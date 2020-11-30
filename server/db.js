
const mysql = require('mysql'); //mysql包
const config = require('./database.config.js'); //数据库配置

class CustomDB {
    /**
     * config一些配置文件，例如主机、端口、用户、密码....
     */
    constructor(config = {}) {
        this.config = config;
    }

    /**
     * 执行sql
     */
    query(sql, params) {
        let me = this;
        return new Promise((resolve, reject) => {
            const connection = mysql.createConnection(me.config);
            connection.connect(err => {
                if (err) reject('DATABASE ERROR：connection failed!')
            });

            //Execute SQL statement
            connection.query(sql, params, (err, results, fileds) => {
                if (err) reject(`DATABASE ERROR：${err.message}`);
                resolve(results, fileds);

                //Close the connection
                connection.end(err => {
                    reject('DATABASE ERROR：close connection failed!')
                });
            });
        });
    }

    /**
     * 插入数据，单行插入
     * @param table
     * @param datas
     */
    insert({ table, datas }) {
        return new Promise(async (resolve, reject) => {
            try {
                let fields = ''; //字段名
                let values = []; //字段值
                for (let key in datas) {
                    fields += key + ','
                    values.push(datas[key]);
                }
                fields = fields.slice(0, -1);
                values = JSON.stringify(values).slice(1, -1);
                const insertSql = `INSERT INTO ${table} (${fields}) VALUES (${values})`;
                let insertResult = await this.query(insertSql); //写入结果

                //是否成功写入
                if (insertResult.affectedRows > 0) {
                    resolve(insertResult)
                } else {
                    reject(`INSERT ERROR: ${insertResult.message}`);
                }
            } catch (error) {
                reject(typeof error === 'object' ? `ABNORMAL PRGORAM：${error.message}` : error);
            }
        });
    }

    /**
     * 更新
     */
    update({ table, sets, where }) {
        return new Promise(async (resolve, reject) => {
            try {
                let setData = '';
                for (let key in sets) {
                    let value = typeof sets[key] === 'string' ? `"${sets[key]}"` : `${sets[key]}`;
                    setData += `${key}=${value}, `;
                }
                setData = setData.slice(0, -2);
                const updateSql = `UPDATE ${table} SET ${setData} WHERE ${where}`;
                console.log(updateSql);
                let updateResult = await this.query(updateSql);
                if (updateResult.changedRows === 0) {
                    reject(`UPDATE ERROR: ${updateResult.message}`, updateResult);
                } else {
                    resolve(updateResult);
                }
            } catch (error) {
                reject && reject(typeof error === 'object' ? `ABNORMAL PRGORAM：${error.message}` : error);
            }
        });
    }

    /**
     * 删除
     * @param table
     */
    delete({ table, where }) {
        return new Promise(async (resolve, reject) => {
            try {
                const deleteSql = `DELETE FROM ${table} WHERE ${where}`;
                let deleteResult = await this.query(deleteSql);
                if (deleteResult.affectedRows === 0) {
                    reject(`DELETE ERROR: ${deleteResult.message}`, deleteResult);
                } else {
                    resolve(deleteResult);
                }
            } catch (error) {
                console.log(error);
                reject && reject(typeof error === 'object' ? `ABNORMAL PRGORAM：${error.message}` : error);
            }
        });
    }
}

//导出模块
module.exports = new CustomDB(config); //初始化实例，传入配置文件
