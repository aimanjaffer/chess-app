// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function helloAPI(req, res) {
  console.log(req.body);
  //TODO: validate whether the move is valid and return an updated boardState
  res.status(200).json({ name: 'John Doe' })
}
