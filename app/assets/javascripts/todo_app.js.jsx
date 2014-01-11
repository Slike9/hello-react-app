/** @jsx React.DOM */
//= require todo_item

var new_item_placeholder = 'Add text here';

var TodoList = React.createClass({
  render: function(){
    return (
      <table className="table table-stropped">
        <tbody>
          {this.props.items.map(function(item){
            return <TodoItem key={item.id}
                             item={item}
                             onItemEditDone={this.props.onItemEditDone}
                             onItemDelete={this.props.onItemDelete}
                             onItemStateChange={this.props.onItemStateChange}/>;
                             }.bind(this))}
        </tbody>
      </table>);
  }
});

var Statistics = React.createClass({
  render: function(){
    var items = this.props.items;
    var doneItemCount = _.where(items, {state: 'done'}).length;
    return (
      <table className='table'>
        <thead>
          <tr>
            <th>Active</th>
            <th>Done</th>
            <th>All</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{items.length - doneItemCount}</td>
            <td>{doneItemCount}</td>
            <td>{items.length}</td>
          </tr>
        </tbody>
      </table>);
  }
});

var TodoApp = React.createClass({
  getInitialState: function(){
    return {items: [], text: "", counter: 0};
  },

  handleSubmit: function(e){
    e.preventDefault();
    var new_items = this.state.items.concat([{text: this.state.text || new_item_placeholder, id: this.state.counter}]);
    this.setState({text: "", items: this.orderItems(new_items), counter: this.state.counter + 1});
  },

  onChange: function(e){
    this.setState({text: e.target.value});
  },

  onItemEditDone: function(itemProps){
    var item = _.findWhere(this.state.items, {id: itemProps.id});
    item.state = "active";
    if (itemProps.text)
      item.text = itemProps.text;
    this.setState({items: this.state.items});
  },

  onItemStateChange: function(itemProps){
    var item = _.findWhere(this.state.items, {id: itemProps.id});
    item.state = itemProps.state;
    this.setState({items: this.orderItems(this.state.items)});
  },

  orderItems: function(items){
    var itemsById = _.sortBy(items, function(item){return item.id});
    var activeItems = _.filter(itemsById, function(item){ return item.state != 'done'; });
    var doneItems = _.filter(itemsById, function(item){ return item.state == 'done'; });
    return activeItems.concat(doneItems);
  },

  onItemDelete: function(id){
    var newItems = _.reject(this.state.items, function(item) { return item.id == id });
    this.setState({items: newItems});
  },

  render: function(){
    return (
      <div className='row'>
        <div className='col-xs-6'>
          <form className='form-inline' role='form' onSubmit={this.handleSubmit}>
            <div className='form-group'>
              <input
              placeholder={new_item_placeholder}
              className='form-control adding-item-text'
              onChange={this.onChange}
              value={this.state.text}/>
            </div>
            <button type='submit' className='btn btn-primary' disabled={!this.state.text}>Add</button>
          </form>
          <TodoList items={this.state.items}
          onItemClick={this.onItemClick}
          onItemChange={this.onItemChange}
          onItemEditDone={this.onItemEditDone}
          onItemDelete={this.onItemDelete}
          onItemStateChange={this.onItemStateChange}/>
        </div>
        <div className='col-xs-6'>
          <Statistics items={this.state.items}/>
        </div>
      </div>
      );
  }
});
