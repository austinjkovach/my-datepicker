import './MyDatePicker.css';

export default class MyDatePicker extends Component {

  state = {
    getMonthDetails: []
  }

  componentDidMount() {
    window.addEventListener('click', this.addBackDrop);
  }

  componentWillUnMount() {
    window.removeEventListener('click', this.addBackDrop);
  }

  addBackDrop = e => {
    if(this.state.showDatePicker && !ReactDOM.findDOMNode(this).contains(e.target)) {
      this.showDatePicker(false);
    }
  }

  showDatePicker = (showDatePicker=true) => {
    this.setState({ showDatePicker });
  }

  render() {
    return (
      <div className='MyDatePicker'>
        <div className='mdp-input' onClick={()=> this.showDatePicker(true)}>
            <input type='date'/>
        </div>
        {this.state.showDatePicker ? (
            <div className='mdp-container'>
            </div>
        ) : ''}
      </div>
    )
  }
}
