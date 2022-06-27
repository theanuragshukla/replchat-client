
const url = 'https://nodereplchat.herokuapp.com/'
const chalk = require('chalk');
const user = process.argv[2]
const room = process.argv[3]
const figlet = require('figlet')
let logo = false
let loading=true
let socket
const rl = require('readline')
const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
})
const color = ['red', 'green', 'blue', 'magenta', 'cyan', 'white'];
const inpMsg =async (ques,cb)=>{
	readline.question(ques,(msg)=>{
		rl.moveCursor(process.stdout,0,-2)
		rl.clearScreenDown(process.stdout)
		cb(msg)
	})
}
const printMsg =async (msg) =>{
	await socket.emit('message',{msg,user})
	inpMsg('# ',printMsg)
}
const log = async(msg,newLine) => {
	if(newLine)
		process.stdout.write("\n\n")
	process.stdout.write(msg)
}
const clrL = () => {
	process.stdout.write("\r\x1b[K")
}
const connecting =async ()=>{
	while(loading){
		log(chalk.greenBright("connecting."))
		await sleep(250)
		clrL()
		log(chalk.greenBright("connecting.."))
		await sleep(250)
		clrL()
		log(chalk.greenBright("connecting..."))
		await sleep(250)
		clrL()
	}
	if(!loading){
		clrL()
		console.log(chalk.yellow("connected to server!"))
		console.log(chalk.yellow("\nTry Sending a message :)"))
	}
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

const wait = async () => {
	if(logo){
		return
	}
	await sleep(250)
	return wait()
}
/*
const printIncoming =async (msg,usr,clr,uid)=>{
	rl.moveCursor(process.stdout, 0, -2)
	clrL()
	log(chalk[color[clr]](`${usr}#${uid}` + ': ' + msg.split('\n')[0]))
	rl.moveCursor(process.stdout, 0, 2)
	rl.clearScreenDown(process.stdout)
	console.log('\n')
	inpMsg('# ',printMsg)

}
*/
const printIncoming = (msg,usr,clr,uid)=>{
	rl.moveCursor(process.stdout, 0, -1)
	clrL()
	log(chalk[color[clr]](`${usr}#${uid}` + ': ' + msg.split('\n')[0]))
	rl.clearScreenDown(process.stdout)
	console.log('\n')
	inpMsg('# ',printMsg)

}
const startup = async()=>{
	figlet("REPL CHAT",async (err,data)=>{
		console.log(chalk.red(data))
		logo=true
	})
	await wait()
	connecting()
	socket = require('socket.io-client')(url)
	socket.emit('usrInfo',user,room)
	socket.on('connect', async () => {
		if(user==null || user==undefined || user.length<=3){
			console.log(chalk.red("\n\nsomething is wrong! please restart the program."))
			process.exit(1)
		}else{
			loading=false
		}
		await sleep(1000)
		console.log('\n\n\n')
		inpMsg('# ',printMsg)

		socket.on('disconnect', ()=> {
			socket.emit('disconnect')
		})
		socket.on('message', (data,clr,uid) => {
			const { msg, user } = data
			printIncoming(msg,user,clr,uid)
		})
		socket.on('yourMsg',(data,clr,uid)=>{
			const { msg} = data
			printIncoming(msg,"you",clr,uid)

		})
	})

}

startup()	
