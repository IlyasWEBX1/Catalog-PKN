import logo from '../logo.svg';
import '../App.css';

function Home() {
  return (
      <div className="Home">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <h1 className="text-4xl font-bold text-red-500">Tailwind is working!</h1>
          <h1 className="text-2xl font-bold text-blue-500">Welcome to home</h1>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
  );
}

export default Home;
