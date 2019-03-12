const spawn=require('child_process').spawn
const http=require('http')
const url=require('url')
const fs=require('fs')
const path=require('path')
const promisify=require('util').promisify

function new_convert_step1(mp3Path) {
    return new Promise((resolve,reject)=>{
        let targetPath=path.join('tmp',path.basename(mp3Path,'.mp3')+'.wav')
        let child=spawn('bin/ffmpeg.exe',['-i',mp3Path,targetPath])
        child.on('close',()=>{
            return resolve(targetPath)
        })
        child.on('error',reject)
    })
}

function new_convert_step2(wavPath) {
    return new Promise((resolve,reject)=>{
        let targetPath=path.join('tmp',path.basename(wavPath,'.wav')+'.dfpwm')
        let child=spawn('java',['-jar','bin/LionRay.jar',wavPath,targetPath])
        child.on('close',()=>{
            return resolve(targetPath)
        })
        child.on('error',reject)
    })
}

async function new_convert(mp3Path) {
    console.log(`Convert Step 1: ${mp3Path}`)
    let wavPath=await new_convert_step1(mp3Path)
    console.log(`Convert Step 2: ${wavPath}`)
    let resultPath=await new_convert_step2(wavPath)
    console.log(`Convert Result: ${resultPath}`)
    fs.unlink(wavPath,(err)=>{
        if(err) {
            console.log(`WARN: ${wavPath} is not removed.`)
        }
    })
    return resultPath
}

function request_music(req,res) {
    let chunk=''
    req.on('data',(data)=>{
        chunk+=data
    })
    req.on('end',async ()=>{
        try {
            let musicPath=path.join('mp3',chunk)
            await promisify(fs.access)(musicPath)
            let targetPath=await new_convert(musicPath)
            let data=await promisify(fs.readFile)(targetPath)
            res.writeHead(200,"OK")
            res.write(data)
            res.end()
        } catch (e) {
            console.log(e)
            res.writeHead(500,"Server internal error")
            res.end(e.toString())
        }
    })
}

function requestHandler(req,res) {
    let urlinfo=url.parse(req.url)
    if(urlinfo.path=='/music' && req.method=="POST") {
        request_music(req,res)
    } else if(urlinfo.path=='/list' && req.method=="GET") {
        fs.readdir('mp3',(err,files)=>{
            if(err) {
                res.writeHead(500,"Failed to readdir.")
                res.end(err.toString())
            } else {
                res.writeHead(200,"OK")
                res.write("==========\n")
                files.forEach((fname)=>{
                    res.write(`${fname}\n`)
                })
                res.end("==========\n")
            }
        })
    } else {
        res.writeHead(400,"Bad request")
        res.end("GET /list or POST /music instead.")
    }
}

const server=http.createServer(requestHandler)
server.listen(59612)
