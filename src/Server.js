M.host = "http://localhost:8889";
//app.begin((req,res)=>console.log(req.params))
// console.log(app._begin)

app.post("/listByPage",function (req,res) {
    let whereCase="1=1 ";
    if(req.params.name){
        whereCase=whereCase+` and name like '%${req.params.name}%'`
    }
    const sql1=` 
    select * from sys_server_info  where ${whereCase}  limit  ${(req.params.startPage-1)*req.params.limit},${req.params.limit}`
   const sql2= `
        select count(1) c from sys_server_info  where ${whereCase};
    `;
    M.doSql(sql1, (d) => {
        let rows = d.data;
        M.doSql(sql2, (d) => {
            let total = d.data[0].c;
            res.send({rows,total});
        });
    })
});


app.post("/addOrUpdate",function (req,res) {
    let sql=""
    if(req.params.id){
        sql=M.Db().getUpdateObjSql("sys_server_info",req.params,{id:req.params.id})+";";
    }else {
        delete(req.params.id);
        sql=M.Db().getInsertObjSql("sys_server_info",req.params)+";";
    }
    M.doSql(sql,(d)=>{
        res.send(M.result(d));
    })
});