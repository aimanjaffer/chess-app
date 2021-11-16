export default function credentialsLoginAPI(req, res) {
    //console.log("receiving: ", req.body);
    res.status(200).json({ 
        "email": req.body.username
       });
}  