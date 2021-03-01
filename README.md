# gsmTerm
On Raspberry Pi Zero:  
Check:  
https://github.com/sdesalas/node-pi-zero  
Fix firebase error:   
```
npm install -g node-pre-gyp  
npm rebuild --build-from-source grpc  
```
#To run server on startup an manage it (in project dir):
```
npm install -g pm2
pm2 start npm -- start
pm2 startup
pm2 save
```