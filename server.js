import express from "express";
import ViteExpress from "vite-express";
import minify from "express-minify";
import compression from "compression";
import bodyParser from "body-parser";
import path from "path";
import cors from 'cors';
const PORT = process.env.PORT || 80;
const app = express();
// config API Rules  
const __dirname = path.dirname(new URL(import.meta.url).pathname);
app.use(express.static(path.join(__dirname, 'storage')));
// app.use(express.static(path.join(__dirname, 'dist')));
// app.use("/", express.static(path.join(__dirname, '/')));
app.use(bodyParser.json());
app.use(compression());
app.use(cors({
  origin: "*",
  optionsSuccessStatus: 200,
}))
app.use(minify());
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });
// Start express server
ViteExpress.listen(app, PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
