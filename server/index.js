const mysql = require('mysql');

const express = require('express');
const app = express();

const path = require('path');
const {v4} = require('uuid');

const mail = require('./mail/transporter.js');
const transporter = new mail();
transporter.init();

const db_table = 'users';
const db_auth = {
    host: 'mysql77.hostland.ru',
    user: 'host1820111',
    password: 'bnbSFLDKtB',
    database: 'host1820111'
}
let conn = mysql.createConnection(db_auth);

conn.connect();

app.use(express.json());

const time_to_activate = 3600; // Время на активацию в секундах

// LogIn
    app.post('/api/auth', (req, res) => {
        let email = req.body.email,
            password = req.body.password;
        

        conn.query(`SELECT * FROM ${db_table} WHERE email = '${email}' AND password = '${password}'`, function (err, rows, fields) {
            if (err) {
                conn.end();
                conn = mysql.createConnection(db_auth);
                conn.connect();
                throw err;
            }
            console.log(rows);
            let respBody = {
                success: rows.length == 1 ? true : false,
                data: rows[0]
            }
            conn.query(`UPDATE  ${db_table} SET is_auth = TRUE WHERE email = '${email}' AND password = '${password}'`, function (err, rows, fields) {
                if (err) {
                    conn.end();
                    conn = mysql.createConnection(db_auth);
                    conn.connect();
                    throw err;
                }
                
                res.status(200).json(respBody);
            });
            
            
        }); 
    });

// Logout
    app.post('/api/logout', (req, res) => {
        let id = req.body.id;

        conn.query(`UPDATE  ${db_table} SET is_auth = FALSE WHERE id = '${id}'`, function (err, rows, fields) {
            if (err) {
                conn.end();
                conn = mysql.createConnection(db_auth);
                conn.connect();
                throw err;
            }
            let respBody = {
                success: true
            };
            
            res.status(200).json(respBody);
        });
        
    });

// Check auth
    app.post('/api/check_auth', (req, res) => {
        let id = req.body.id;

        conn.query(`SELECT * FROM ${db_table} WHERE id = '${id}' AND is_auth = TRUE`, function (err, rows, fields) {
            if (err) {
                conn.end();
                conn = mysql.createConnection(db_auth);
                conn.connect();
                throw err;
            }
            console.log(rows);
            let respBody = {
                success: rows.length == 1 ? true : false,
                data: rows[0]
            }
            res.status(200).json(respBody);
        }); 
    });

// Registration

    app.post('/api/registration', (req, res) => {
        let respBody, 
            login = req.body.login,
            email = req.body.email,
            password = req.body.password,
            role = req.body.role;
        

        conn.query(`SELECT * FROM ${db_table} WHERE email = '${email}'`, function (err, rows, fields) {
            if (err) throw err;
            if (rows.length == 0) {
                let id = v4();
                conn.query(`INSERT INTO ${db_table} VALUES('${id}', '${login}', '${email}', '${password}', '${role}','false-${Date.now()}')`, function (err, rows, fields) {
                    if (err) throw err;
                    console.log('user create');
                    respBody = {
                        success: true,
                        data: req.body
                    };
                    respBody.data.id = id;
                    res.status(201).json(respBody);
                    transporter.sendMail({
                        to: email,
                        subject: 'Регистрация на ProfMaster',
                        text:`Для активации аккаунта перейдите по ссылке http://localhost:3000/api/activate?id=${id} . Cсылка активна в течении одного часа.`,
                        html:
                            `Для активации аккаунта перейдите по  <a href="http://localhost:3000/api/activate?id=${id}">ссылке</a>. Cсылка активна в течении одного часа.`,
                    });
                    setTimeout(() => {
                        conn.query(`SELECT * FROM ${db_table} WHERE email = '${email}'`, function (err, rows, fields) {
                            if (err) throw err;
                            console.log(rows[0].is_active);
                            if (rows[0].is_active.split('-')[0] != 'true') {
                                conn.query(`DELETE FROM ${db_table} WHERE id = '${rows[0].id}'`, function (err, rows, fields) {
                                    console.log(email + ' deleted');
                                });
                            }
                        });
                    }, time_to_activate*1000);
                });        
            } else {
                respBody = {
                    success: false
                };
                res.status(200).json(respBody);
            }
            
        })
    });

// Account activate
    app.get('/api/activate', (req, res) => {
        let id = req.query.id;       

        conn.query(`UPDATE ${db_table} SET is_active='true' WHERE id = '${id}';`, function (err, rows, fields) {
            if (err) throw err;
            res.redirect('http://localhost:3000/');
        });         
        
    });

// Forgot password (send req)
    app.post('/api/recovery_pass', (req, res) => {
        let email = req.body.email;       
        
        conn.query(`SELECT * FROM ${db_table} WHERE email = '${email}'`, function (err, rows, fields) {
            if (err) throw err;
            if (rows.length == 1) {
                transporter.sendMail({
                    to: email,
                    subject: 'Восстановление пароля на ProfMaster',
                    text:`Для создания нового пароля перейдите по ссылке http://localhost:3000/api/recovery_pass_new?id=${rows[0].id} . Cсылка активна в течении одного часа.`,
                    html:
                        `Для создания нового пароля перейдите по  <a href="http://localhost:3000/api/recovery_pass_new?id=${rows[0].id}">ссылке</a>. Cсылка активна в течении одного часа.`,
                });

                
            } 
            let respBody = {
                success: rows.length == 1 ? true : false
            };
            res.status(200).json(respBody);            
        });         
        
    });

// Forgot password (send res)
    app.get('/api/recovery_pass_new', (req, res) => {
        let id = req.query.id;       
        console.log(id);
        res.redirect(`http://localhost:3000/recovery_pass/recover.html?id=${id}`);
    });

// Forgot password (update pass)
    app.post('/api/update_pass', (req, res) => {
        let pass = req.body.pass,
            id = req.body.id;     
        console.log(req.body);
        conn.query(`UPDATE ${db_table} SET password='${pass}' WHERE id = '${id}';`, function (err, rows, fields) {
            if (err) throw err;            
            respBody = {
                success: true
            };
            res.status(201).json(respBody);
        });         
        
    });

// Change user data
    app.post('/api/change_user', (req, res) => {
        let respBody, 
            login = req.body.login,
            email = req.body.email,
            old_email = req.body.old_email,
            password = req.body.pass,
            new_pass = req.body.new_pass,
            access = false;
        conn.query(`SELECT * FROM ${db_table} WHERE email = '${old_email}' AND password = '${password}'`, function (err, rows, fields) {
            if (err) {
                respBody = {
                    success: false,
                    error: 'Не удалось обновить данные',
                    error_type: 2
                };
                res.status(400).json(respBody);
                throw err;
            }  
            if (rows.length == 1) access = true; 
            console.log(access); 
            if (!access) {
                respBody = {
                    success: false,
                    error: 'Неверный пароль',
                    error_type: 3
                };
                console.log('ahh');
                res.status(400).json(respBody);
                return;
            }
    
            conn.query(`SELECT * FROM ${db_table} WHERE email = '${email}'`, function (err, rows, fields) {
                if (err) {
                    respBody = {
                        success: false,
                        error: 'Не удалось обновить данные',
                        error_type: 2
                    };
                    res.status(400).json(respBody);
                    throw err;
                }
                if ((rows.length == 0 && email != old_email) || (rows.length == 1 && email == old_email)) {
                    let sql = '', email_sql = '';
                    if (email != old_email) email_sql = `,email='${email}'`;
                    if (new_pass == '') sql = `UPDATE ${db_table} SET login='${login}' ${email_sql} WHERE email='${old_email}'`;
                    else sql =  `UPDATE ${db_table} SET login='${login}' ${email_sql} , password='${new_pass}' WHERE email='${old_email}'`;
                    conn.query(sql, function (err, rows, fields) {
                        if (err) {
                            respBody = {
                                success: false,
                                error: 'Не удалось обновить данные',
                                error_type: 2
                            };
                            res.status(400).json(respBody);
                            throw err;
                        }
                        console.log('user update');
                        respBody = {
                            success: true,
                            data: {
                                login: login,
                                email: email
                            }
                        };
                        res.status(201).json(respBody);
                        transporter.sendMail({
                            to: old_email,
                            subject: 'Изменения аккаунта на ProfMaster',
                            text:`Если вы не вносили изменения в свой аккаунт просьба сообщить в поддержку.`,
                            html:
                                `Если вы не вносили изменения в свой аккаунт просьба сообщить в поддержку.`,
                        });
                    });        
                } else {
                    respBody = {
                        success: false,
                        error: 'Данный email занят',
                        error_type: 1
                    };
                    res.status(200).json(respBody);
                }
                
            });        
        });
       
    });

app.use(express.static(path.resolve(__dirname, '../app-xyz/build')));

// app.get('/recovery_pass/recover.html', (req, res) => {
//     res.resolve(__dirname, '/recovery_pass', 'recover.html');
// });
app.get('*', (req, res) => {
    console.log(req.params[0]);
    if (req.params[0] == '/recovery_pass/recover.html') {
        res.sendFile(path.resolve(__dirname, './recovery_pass', 'recover.html'));
    } else {
        res.sendFile(path.resolve(__dirname, '../app-xyz/build', 'index.html'));
    }
    
});


app.listen(3000, () => {
    console.log('server started...');
});

