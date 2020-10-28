import logo from './logo.svg';
import './App.css';
import MyDatePicker from './MyDatePicker/MyDatePicker';

function onChange(timestamp) {
  console.log(timestamp);
}

function App() {
  return (
    <div className="App">
      <MyDatePicker onChange={onChange} />
    </div>
  );
}

export default App;
