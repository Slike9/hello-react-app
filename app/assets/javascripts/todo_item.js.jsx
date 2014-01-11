/** @jsx React.DOM */

var TodoItem = React.createClass({
  getInitialState: function(){
    return {isEdit: false, text: '', state: 'normal'};
  },
  componentDidUpdate: function(){
    if (this.refs.itemText && this.state.state == 'editStart'){
      this.refs.itemText.getDOMNode().focus();
      this.setState({state: 'edit'});
    }
  },
  handleSubmit: function(e){
    e.preventDefault();
    this.saveItemText();
  },
  saveItemText: function(){
    this.props.onItemEditDone({id: this.props.item.id, text: this.state.text});
    this.setState({state: 'normal'});
  },
  startEditText: function(){
    this.setState({state: 'editStart', text: this.props.item.text});
  },
  cancelEditText: function(){
    this.setState({state: 'normal'});
  },
  onTextChange: function(e){
    this.setState({text: e.target.value});
  },
  onDoneChange: function(e){
    this.props.onItemStateChange({id: this.props.item.id, state: (e.target.checked ? 'done' : 'active')});
  },
  closeItem: function(){
    this.props.onItemStateChange({id: this.props.item.id, state: 'done'});
  },
  renderEditState: function(item){
    return (
      <tr ref='todoItem'>
        <td className='item__doneMark'/>
        <td>
          <form
            className="form-inline"
            onSubmit={this.handleSubmit}>
            <div className="form-group">
              <input
                ref='itemText'
                className="form-control item__editText"
                value={this.state.text}
                onChange={this.onTextChange}/>
            </div>
          </form>
        </td>
        <td className='item__actions'>
          <button type='button'
                  className='btn btn-primary btn-xs'
                  onClick={this.saveItemText}
                  disabled={!this.state.text || this.state.text == this.props.item.text}>Save</button>
          <button type='button' className='btn btn-default btn-xs' onClick={this.cancelEditText}>Cancel</button>
        </td>
      </tr>);
  },

  renderNormalState: function(item){
    var cx = React.addons.classSet;
    var classes = cx({
      'item-done': item.state == "done"
    });
    return (
      <tr className={classes} ref='todoItem'>
        <td className='item__doneMark'>
          <input type='checkbox' onChange={this.onDoneChange} checked={item.state == "done"}/>
        </td>
        <td>
          <span className='item__text' onClick={this.startEditText}>{item.text}</span>
        </td>
        <td className='item__actions'>
          <div>
            <button
              type='button'
              className="btn btn-xs btn-success item-done-btn"
              onClick={this.closeItem}>
              Done
            </button>
            <button
              type='button'
              className="btn btn-xs btn-danger"
              onClick={this.props.onItemDelete.bind(null, this.props.item.id)}>
              Delete
            </button>
          </div>
        </td>
      </tr>);
  },

  render: function(){
    var item = this.props.item;
    return _.include(['editStart', 'edit'], this.state.state) ? this.renderEditState(item) : this.renderNormalState(item);
  }
});
