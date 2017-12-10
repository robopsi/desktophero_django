import sys

with open(sys.argv[1]) as fh:
    config = dict([(line[:line.index(':')], 
                    line[line.index(':') + 2:].strip()) for line in fh.readlines()])

sys.path.append(config['PROJECT_ROOT'])
sys.path.append(config['SITE_PACKAGES'])

import os
os.environ["DJANGO_SETTINGS_MODULE"] = "desktophero_django.settings"
from os.path import basename, splitext, isfile

import django
django.setup()

import time
from datetime import datetime
from os.path import basename
from resources.models import Asset, AssetForProcessing
from urllib.request import urlretrieve
import requests
import subprocess

from pprint import pprint

s3_url = config['S3_URL']
processing_dir = config['PROCESSING_DIR']
blender_script = config['BLENDER_SCRIPT']
blend_file = config['BLEND_FILE']
blender_exe = config['BLENDER_EXE']

def main():
    while True:
        awaiting_processing = AssetForProcessing.objects.filter(status='waiting')

        for entry in awaiting_processing:
            print('Found entry: {}'.format(entry.name))

            # Update record in database
            entry.status = 'processing'
            entry.processing_started = datetime.now()
            entry.save()

            try:
                # Download STL file
                read_from_url = entry.mesh.url
                save_to_url = '{}/{}'.format(processing_dir, basename(entry.mesh.url))
                urlretrieve(read_from_url, save_to_url)
                # Launch blender processing and wait until finished
                cmd = [blender_exe,
                       '--background',
                       blend_file,
                       '--python',
                       blender_script,
                       '--',
                       save_to_url,
                       '--px', str(entry.px),
                       '--py', str(entry.py),
                       '--pz', str(entry.pz),
                       '--rx', str(entry.rx),
                       '--ry', str(entry.ry),
                       '--rz', str(entry.rz),
                       '--sx', str(entry.sx),
                       '--sy', str(entry.sy),
                       '--sz', str(entry.sz),
                       '--attach_to_group', entry.attachToGroup,
                       '--attach_to_bone', entry.attachToBone]
                if entry.rigid:
                    cmd.append('--rigid')

                print(' '.join(cmd))
                return_code = subprocess.check_call(cmd)
                print('Process finished with return code {}'.format(return_code))

                # Try to POST the new asset using the auto account

                thumbnail = '{}.png'.format(save_to_url[:-4])
                if not isfile(thumbnail):
                    print('No thumbnail for {}.'.format(thumbnail))
                    thumbnail = None

                filename = '{}_medres.js'.format(save_to_url[:-4])
                if not isfile(filename):
                    print('No file for {}.'.format(filename))

                filename_hires = '{}_hires.js'.format(save_to_url[:-4])
                if not isfile(filename_hires):
                    print('No hires file {}.'.format(filename_hires))

                filename_lowres = '{}_lowres.js'.format(save_to_url[:-4])
                if not isfile(filename_lowres):
                    print('No lowres file {}.'.format(filename_lowres))

                login_url = 'http://localhost:7000/accounts/login/'
                post_url = 'http://localhost:7000/resources/assets/submit/'
                client = requests.session()
                client.get(login_url)
                csrf_token = client.cookies.get('csrftoken')

                response = client.post(login_url, data={
                                                        'username': config['ACCOUNT_USERNAME'],
                                                        'password': config['ACCOUNT_PASSWORD'],
                                                        'csrfmiddlewaretoken': csrf_token,
                                                        'next': '/'
                                                       })

                csrf_token = client.cookies.get('csrftoken') # Token has changed

                data = {
                        'csrfmiddlewaretoken': csrf_token,
                        'name': entry.name,
                        'description': entry.description,
                        'category': entry.category,
                        'license': entry.license,
                        'author': entry.author.id
                       }

                files = {
                         'thumbnail': open(thumbnail, 'rb'),
                         'mesh': open(filename),
                         'mesh_lowres': open(filename_lowres),
                         'mesh_hires': open(filename_hires)
                        }

                pprint(data)
                pprint(files)

                response = requests.post(post_url,
                                         data=data,
                                         files=files,
                                         headers=dict(Referer=login_url))
                print(response)
                if response.status_code == 200:
                    entry.status = 'complete'
                    entry.message = 'Processing completed, POST returned 200.'
                else:
                    with open('{}_{}_error.html'.format(entry.name, entry.pk), 'w') as outfile:
                        outfile.write(str(response.content))

                    entry.status = 'error'
                    entry.message = 'POST failed with status code {}. Check error logs.'.format(response.status_code)
                
                entry.processing_finished = datetime.now()
                entry.save()

                # Delete generated files
                for file in [#thumbnail,
                             filename,
                             filename_hires,
                             filename_lowres,
                             save_to_url]:
                    try:
                        os.remove(file)
                    except:
                        pass

            except Exception as err:
                with open('{}_{}_error.txt'.format(entry.name, entry.pk), 'w') as outfile:
                    outfile.write(str(err))

                entry.status = 'error'
                entry.message = 'Processing failed. Check logs for details.'
                entry.processing_finished = datetime.now()
                entry.save()

        time.sleep(10)

if __name__ == '__main__':
    main()
