const {createAccount} = require('../utils/create_user');
const {validateEmail} = require('../utils/mail_validator');
const {generateId, generateToken} = require('../utils/generate_string');
const bcryptjs = require('bcryptjs');
const axios = require('axios').default;

const express = require('express')
const app = express();
 
//const {getConnection} = require('../utils/db_connector');
//const connection = getConnection();
const Database = require('../utils/db_class');
const DB = new Database();

//const debug = require('debug')('app:userController');
 
exports.createUser = async (req,res,next) => {
    const {name, email, password, organisation} = req.body; //add password column in DB
    if (!name || !email || !password || !organisation) {
        res.status(400).send({
          status: 'failed',
          data: {message:
             'Add name, email, password and organisation in json format. This ia an example -> {"name":"olawale micheal juwon", "email": "olawalejuwon@gmail.com", "password": "your_password", "organisation":"HNG"}'}
        })
        return
      }

      let emailsAreValid = validateEmail(email);
        if(!emailsAreValid){
          res.status(400).send({
            status: 'failed',
            data: {message: 'Invalid email!'}
          })
          return
        }
        
        // CHECK IF EMAIL IS ALREADY REGISTERED
        let query = " SELECT email FROM users WHERE `email` = ? ";
        let queryemail = await DB.query( query, [email] )
        if ( queryemail.length > 0 ) {
            return res.status(400).send({
                status: 'failed',
                data: {message: 'email already registered!'}
            })
        }
        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

        let user_id = generateId(5);
        let token = generateToken(15);
        hashedPassword = await bcryptjs.hash(password, 12); // create a 12 character hash of the inputed password
        if(createAccount(email,hashedPassword,name,organisation,user_id,token)){
            res.status(201).send({
                status: 'success',
                data: {message: 'account created! Request Body Extracted',
                 name: name, email: email, organisation: organisation,
                 account_id:user_id,access_token:token
            }
              })
              return
        }else{
            res.status(500).send({
                status: 'error',
                data: {message: 'error creating account!'}
              })
              return
        }
}

exports.configureUser = (req, res, next) => {
    const {protocol, account_id, access_token} = req.body;
    //
    let sql = 'SELECT * FROM users WHERE account_id = ?';
    let sql2 = `UPDATE users
                            SET protocol = ?
                            WHERE account_id = ?`;
    DB.query(sql, [account_id])
        .then(rows =>{
            if(rows.length>0){
                console.log('User Exist with token: ~');
                console.log(rows[0].token);
                if(access_token == rows[0].token){
                     
                    return DB.query(sql2,[protocol,account_id]);
                }
                else{
                    return new Promise((resolve, reject)=>reject('Invalid Token')) 
                }
            }
            return new Promise((resolve, reject)=>reject('Invalid ID'))
        }, err => {
            //return DB.close().then( () => { throw err; } )
            return new Promise((resolve, reject)=>reject(err))
        } )
        .then(rows => {
            res.status(200).send({
                status: 'success',
                data: {message: 'protocol updated!'}
              })
              return
        }, err => {
            return new Promise((resolve, reject)=>reject(err))
        })
        .catch(err => {
            console.log('DB Error: '+err);
            res.status(500).send({
                status: 'error',
                data: {message: err}
              })
              return
        })


    //////////////
    
        
}

exports.loginUser = async (req, res, next) => {
    const {email, password} = req.body;
    if ( !email || !password ) {
        return res.status(400).send({
            status: 'failed',
            data: {message:
               'Add email and password in json format. This ia an example -> {"email": "olawalejuwon@gmail.com", "password": "your_password"}'}
        })
    }

    let sql = " SELECT * FROM users WHERE `email` = ? ";

    try {
        let rows = await DB.query(sql, [email]);
        if ( rows.length > 0 ) {
            let body = rows[0];
            if ( body.disabled == 1 ) { // CHECK IF ACCOUNT IS DISABLED
                await sendMail(
                    body.name,
                    body.email,
                    "MicroApi-Email Team",
                    "hello@microapiemail.ng",
                    "Your account had been disabled",
                    "Click here to enable your account",
                    body.account_id,
                    body.access_token
                )
                return res.status(400).send({
                    status: 'failed',
                    data: {
                        message: "Maximum number of login attempts exceeded; your account has been disabled temporally. Check your email to enable account."
                    }
                })
            }
            let valid = await bcryptjs.compare(password, rows[0].password);
            if ( valid ) {
                return res.status(200).send({
                    status: 'success',
                    data: {
                        message: "Login successful",
                        email: rows[0].email,
                        name: rows[0].name,
                        organisation: rows[0].organisation,
                        account_id: rows[0].account_id,
                        token: rows[0].token,
                        protocol: rows[0].protocol
                    }
                })
            } else {
                // CHECK HOW MANY TIMES USER ATTEMPTED LOGIN
                let max_attempt = 5;
                let sql = " SELECT `invalid_login_count` FROM users WHERE `email` = ? ";
                let count = await DB.query(sql, [email]);
                let login_counts = count[0].invalid_login_count;
                if ( count[0].invalid_login_count == (max_attempt - 1) ) {
                    await sendMail(
                        body.name,
                        body.email,
                        "MicroApi-Email Team",
                        "hello@microapiemail.ng",
                        "Your account had been disabled",
                        "Click here to enable your account",
                        body.account_id,
                        body.access_token
                    )
                    let sql = ` UPDATE users SET invalid_login_count = ${login_counts + 1}, disabled = 1 WHERE email = ?`;
                    await DB.query(sql, [email]);
                    return res.status(400).send({
                        status: 'failed',
                        data: {
                            message: "Maximum number of login attempts exceeded; your account has been disabled temporally. Check your email to enable account."
                        }
                    })
                } else {
                    let sql = ` UPDATE users SET invalid_login_count = ${login_counts + 1} WHERE email = ?`;
                    await DB.query(sql, [email]);
                }
                return res.status(403).send({
                    status: 'failed',
                    data: {
                        message: "Incorrect email or password, please review details and try again"
                    }
                })
            }
        } else {
            return res.status(400).send({
                status: 'failed',
                data: {
                    message: 'Incorrect email or password, please review details and try again'
                }
            })
        }
    } catch (err) {
        console.log(err)
    }
    
}

async function sendMail (recipient_name, recipient_email, sender_name, sender_email, subject, body, account_id, access_token){
    let pload = {
        recipient_name,
        recipient_email,
        sender_name,
        sender_email,
        subject,
        body,
        account_id,
        access_token,
    }

    // SEND EMAIL HERE
}