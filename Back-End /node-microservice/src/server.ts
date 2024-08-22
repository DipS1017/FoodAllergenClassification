import app from "./app";
const port = 3000;
// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

