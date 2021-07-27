const bcrypt= require('bcryptjs');


const Event = require('../../models/event');
const User= require('../../models/user');

const events = async eventIds => {
try {
        const events =  await Event.find({ _id: {in: eventIds }})
            return  events.map(event => {
                 return {
                     ...event._doc, 
                     _id: event.id, 
                     date: new Date(event._doc.date).toISOString(),
                     createdBy: user.bind(this, event.createdBy) 
                    };
     });
} catch (error) {
    throw err;
 }
}

const user = async userId => {
    try {
    const user = await User.findById(userId)
       return { 
           ...user._doc,
            _id: user.id,
            createdEvents: events.bind(this, user._doc.createdEvents)
        }
    } catch (error) {
        throw err;
     }
}

module.exports = {
    events: async () => {
        try {
            const events = await Event.find()
            return events.map(event => {
                return { ...event._doc,
                     _id: event.id,
                     date: new Date(event._doc.date).toISOString(),
                    createdBy: user.bind(this, event._doc.createdBy)
                };
            })
        } 
        catch(err){
            throw err;
        } 
    },
    createEvent: async (args) => {
    const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        createdBy: '34353535'
    });
    let createdEvent;
   
    try {
        const result = await event.save()
        createdEvent = {  
            ...result._doc,
             _id: result._doc._id.toString(),
             date: new Date(event._doc.date).toISOString(),
            createdBy: user.bind(this.result._doc.createdBy) 
            }
        const createdByUser = await User.findById('34353535')
        if (!createdByUser) {
            throw new Error('User not found')
        }
        createdByUser.createdEvents.push(event)
        await createdByUser.save();
    
        return createdEvent;
    } catch (err) {
        console.log(err)
        throw err
    }
    },
    createUser: async (args) =>{
        try {
            const existingUser = User.findOne({email: args.userInput.email})
            if (existingUser) {
                throw new Error('User already exists')
            }
          const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
          const user = new User({
              email: args.userInput.email,
              password: hashedPassword
          });
         const result = await user.save();
            return {...result._doc, password: null, _id: result.id };
        } catch (err) {
            throw err;
        } 
    }
}