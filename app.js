const { Telegraf, Composer , WizardScene , session , Stage } = require('micro-bot')
const mongoose = require('mongoose')
// const postModel = require('./model/postModel')
const groupModel = require('./model/groupList')
const wcModel = require('./model/wcModel')
const userModel = require('./model/userModel')

// const bot = new Telegraf('5111905236:AAGw-gOxgKWHxBujRAdOh5XhLvyc7k179FA')

const bot = new Composer()

bot.use(session())

mongoose.connect('mongodb+srv://rasedul20:rasedul20@telegramproject.gwtce.mongodb.net/groupHandlerBot', {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then((d) => console.log('Database connected')).catch((e) => console.log(e))



bot.start((ctx)=>{
    ctx.telegram.sendMessage(ctx.chat.id , "Hello "+ctx.from.first_name +"\n"+"Welcome to use "+ctx.botInfo.username, {
        reply_markup: {
            keyboard: [
                [{text: "Wake Up"},{text: "SendMessage"}],
                [{text: "SendMessageWithButton"}]
            ],
            resize_keyboard: true
        }
    })
})


bot.on('new_chat_members', (ctx)=>{


    userModel.find({userId: ctx.from.id }).then((user)=>{
        if (user.length > 0) {

            wcModel.find().then((data)=>{

                ctx.telegram.sendMessage(ctx.chat.id , "Hello "+ctx.from.first_name +"\n\n"+ data[0].welcome_message ,{
                    reply_markup: {
                        inline_keyboard: data[0].button
                    }
                }).catch((e)=>{
        
                    console.log(e)
                      
                    ctx.reply("Welcome message set again")
                })
        
            })

        } else {

            const userData = new userModel({
                userId: ctx.from.id,
                userName: ctx.from.username,
                name: ctx.from.first_name
            })
            userData.save().then(()=>{
        
                wcModel.find().then((data)=>{
        
                    ctx.telegram.sendMessage(ctx.chat.id , "Hello "+ctx.from.first_name +"\n\n"+ data[0].welcome_message ,{
                        reply_markup: {
                            inline_keyboard: data[0].button
                        }
                    }).catch((e)=>{
            
                        console.log(e)
                          
                        ctx.reply("Welcome message set again")
                    })
            
                })
        
            }).catch((e)=>console.log(e))
            
        }
    })

})



bot.hears('Wake Up',ctx=>{
    ctx.reply('Hello '+ctx.from.first_name +"\nNow you can use me")
})


bot.command('addOnBot',ctx=>{
    const groupId = ctx.chat.id

    groupModel.find({groupId: groupId}).then((g)=>{
        if(g.length > 0){
            ctx.reply("The group already added in the bot")
        }else{
            const data = new groupModel({
                groupId: groupId
            })
            data.save().then(()=>ctx.reply("Group added successfully"))
        }
    })

})





bot.command('ban', (ctx)=>{
    let input = ctx.update.message.text
    input = input.replace('/ban','')
    input = input.trim()

    ctx.kickChatMember(input).then((data)=>console.log('User Removed')).catch((e)=>console.log(e))

})




const  welcomeScene = new WizardScene('welcomeScene',
    ctx=>{
        ctx.session.post = {}
        ctx.reply('Type your welcome message text')

        return ctx.wizard.next()
    },
    ctx=>{
        const text = ctx.update.message.text
        ctx.session.post.text = text
        ctx.reply('Type your inline button. \n\nEx: Button1 - https://google.com && Button2 - https://google.com')

        return ctx.wizard.next()
    },
    ctx=>{

        let input = ctx.update.message.text

        input = input.toString()


        const p1 = input.split('&&')

        let a = []
        let a1 = []

        const p2 = p1.map((p1)=>{
            return p1.split('-')
        }).map(button => {
            return {
                text: button[0].trim(),
                url: button[1].trim()
            }
        })

        const l1 = p2.length

        p2.forEach((item,i)=>{
            
            a1.push(item)
            
            if (a1.length == 2) {
                a.push(a1)
                a1 = []
            }
            if (!(p2.length % 2) == 0) {  
                if (p2.length == i+1) {
                    const lastItem = [item]
                a.push(lastItem)
                }
            }
        })


        wcModel.find().then((data)=>{

            if (data.length > 0) {

                const id = data[0]._id

                console.log(ctx.session)

                const update = {
                    welcome_message: ctx.session.post.text,
                    button: a
                }

                wcModel.updateOne({_id : id}, update).then(()=>ctx.reply("Welcome message update successfully")).catch((e)=>console.log(e))
                
            } else {

                const data = new wcModel({
                    welcome_message: ctx.session.post.text,
                    button: a
                })

                data.save().then(()=>ctx.reply('Welcome message set successfully')).catch((e)=>{
                    console.log(e)
                    ctx.reply("Something is wrong")
                })

            }

        }).catch((e)=>console.log(e))


        return ctx.scene.leave()

    }

)




const  scene = new WizardScene('scene',
    ctx=>{
        ctx.session.post = {}
        ctx.reply('Type your message text')

        return ctx.wizard.next()
    },
    ctx=>{
        const text = ctx.update.message.text
        ctx.session.post.text = text
        ctx.reply('Type your inline button. \n\nEx: Button1 - https://google.com && Button2 - https://google.com')

        return ctx.wizard.next()
    },
    ctx=>{

        let input = ctx.update.message.text

        input = input.toString()


        const p1 = input.split('&&')

        let a = []
        let a1 = []

        const p2 = p1.map((p1)=>{
            return p1.split('-')
        }).map(button => {
            return {
                text: button[0].trim(),
                url: button[1].trim()
            }
        })

        const l1 = p2.length

        p2.forEach((item,i)=>{
            
            a1.push(item)
            
            if (a1.length == 2) {
                a.push(a1)
                a1 = []
            }
            if (!(p2.length % 2) == 0) {  
                if (p2.length == i+1) {
                    const lastItem = [item]
                a.push(lastItem)
                }
            }
        })


        groupModel.find().then((g)=>{

            console.log(ctx.session.post.text)
            console.log(a)
            
            if (g.length > 0) {
                g.map((item)=>{
                    ctx.telegram.sendMessage(item.groupId , ctx.session.post.text , {
                        reply_markup:{
                            inline_keyboard: a
                        }
                    }).catch((e)=>{
                        console.log(e)
                        ctx.reply('Something is wrong')
                    })
                })

                ctx.reply('Message sent successfully')

            } else {
                ctx.reply("No groups added in the bot")
            }
        })


        return ctx.scene.leave()

    }

)


const scene2 = new WizardScene('scene2',
    ctx=>{
        ctx.reply("Type you message text")

        return ctx.wizard.next()

    },
    ctx=>{
        const input = ctx.update.message.text
        
        groupModel.find().then((g)=>{
            if (g.length > 0) {
                g.map((item)=>{
                    ctx.telegram.sendMessage(item.groupId , input).catch((e)=>ctx.reply("Something is wrong"))
                })
                ctx.reply('Message sent successfully')

            } else {
                ctx.reply("No groups added in the bot")
            }
        })

        return ctx.scene.leave()
    }
)


const stage = new Stage([scene,scene2,welcomeScene])

bot.use(stage.middleware())

bot.hears('SendMessageWithButton',Stage.enter('scene'))
bot.hears('SendMessage',Stage.enter('scene2'))
bot.command('setWelcome',Stage.enter('welcomeScene'))







// bot.launch().then(()=>console.log("Bot started")).catch((e)=>console.log(e))

module.exports = bot
