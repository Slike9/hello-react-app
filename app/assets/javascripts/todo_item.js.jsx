/** @jsx React.DOM */

var TodoItem = React.createClass({
  propTypes: {
    item: React.PropTypes.object.isRequired,
    onItemStateChange: React.PropTypes.func.isRequired,
    onItemEditDone: React.PropTypes.func.isRequired,
    onItemDelete: React.PropTypes.func.isRequired
  },
  getInitialState: function(){
    return {text: '', state: 'show'};
  },
  handleSubmit: function(e){
    e.preventDefault();
    this.saveItemText();
  },
  saveItemText: function(){
    this.props.onItemEditDone({id: this.props.item.id, text: this.state.text});
    this.setState({state: 'show'});
  },
  startEditText: function(){
    this.setState({state: 'edit', text: this.props.item.text}, function(){
      this.refs.itemText.getDOMNode().focus();
    });
  },
  cancelEditText: function(){
    this.setState({state: 'show'});
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
          <a className='item__text' onClick={this.startEditText}>{item.text}</a>
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
    return this.state.state == 'edit' ? this.renderEditState(item) : this.renderNormalState(item);
  }
});
