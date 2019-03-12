# OCAudioServer
Audio server for OpenComputers.

This is the backend provider of `audiostreamer` package. This project use [ffmpeg](https://ffmpeg.org/) to convert mp3 to wav, and use [LionRay](https://github.com/gamax92/LionRay) for convertion from wav to dfpwm.

## Setup

### ServerSide

Make sure [Node.js](https://nodejs.org) is installed and configured properly.

*Currently this project does not use any external libraries. So `npm install` is not needed.*

```
git clone https://github.com/Kiritow/OCAudioServer
cd OCAudioServer
node app
```

### ClientSide

**Grab** is recommended to install the client. See [Grab Quick Setup](https://github.com/Kiritow/OpenComputerScripts#quick-setup) and [Grab Documentation](https://github.com/Kiritow/OpenComputerScripts/blob/master/DOC_Grab.md) for more information.

Once **Grab** is installed, run the following command to install the client:

```
grab install audiostreamer
```

You might have to run it with `-f` or `-cn` option or run `grab update` before it.

## Notice

This AudioServer is started on localhost at port 59612. 

By default, [OpenComputers](https://github.com/MightyPirates/OpenComputers) does not allow connecting to localhost. You can remove anything in section `opencomputers.internet.blacklist` from `.minecraft/config/opencomputers/settings.conf` to enable it.

