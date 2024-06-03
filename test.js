const http= require("http")
const PORT=2020

const server=http.createServer((req,res)=>{
    res.setHeader("200",{"content-type":"text/plain"})
    res.write("my name is favour")
    res.end()

})
 
server.listen(PORT,()=>{
    console.log(`server is connected to ${PORT}`)
})