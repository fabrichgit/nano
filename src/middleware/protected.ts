import { sign } from "jsonwebtoken";

// Middleware pour protéger la route
export const protectRoute = (req: { query: { username: any; password: any; }; }, res: {
    [x: string]: any; redirect: (arg0: string) => void; 
}, next: () => any) => {
    const { username, password } = req.query;
    if (username === process.env.USERNAME && password === process.env.PASSWORD) {
        
    //   res.redirect("/app")
        res.status(200).send({token: sign(Math.random().toString(), process.env.JWT_SECRET as string)})
      return;
    }
    res.status(400).send()
};