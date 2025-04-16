how to set up environment for angular build
cd ~/planvas/assignment/client
nvm install v14.16.1
nvm use v14.16.1
npm install
npm install -g @angular/cli@13.3.4
npm install -g gulp
npm install ngx-bootstrap bootstrap
ng build
ng serve