/** @jsx React.DOM */
// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://coffeescript.org/

var new_item_placeholder = 'Add text here';

var TodoItem = React.createClass({
    handleSubmit: function(e){
        e.preventDefault();
        this.props.onItemEditDone(this.props.item.id);
    },
    onDoneChange: function(e){
        this.props.onItemDoneChange(this.props.item.id, e.target.checked);
    },

    renderItem: function(item){
      var cx = React.addons.classSet;
      var classes = cx({
        'item-done': item.state == "done"
      });
      return item.state == "edit"
        ? <tr>
            <td colSpan='2'>
              <form
                className="form-inline"
                onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <input
                    className="form-control"
                    value={item.text}
                    onChange={this.props.onItemChange.bind(null, item.id)}/>
                </div>
              </form>
            </td>
          </tr>
        : <tr className={classes}>
            <td>
              <input type='checkbox' onChange={this.onDoneChange} checked={item.state == "done"}/>
              <span className='item__text' onClick={this.props.onItemClick.bind(null, item)}>{item.text}</span>
            </td>
            <td>
              <div>
                <button
                  className="btn btn-xs btn-success item-done-btn"
                  onClick={this.props.onItemDone.bind(null, this.props.item.id)}>
                    Done
                </button>

                <button
                  className="btn btn-xs btn-danger"
                  onClick={this.props.onItemDelete.bind(null, this.props.item.id)}>
                    Delete
                </button>
              </div>
            </td>
          </tr>
    },

    render: function(){
      return this.renderItem(this.props.item);
    }
});

var TodoList = React.createClass({
    render: function(){
        return (
          <table className="table table-stropped">
            <tbody>
              {this.props.items.map(function(item){
                return <TodoItem item={item}
                    onItemClick={this.props.onItemClick}
                    onItemChange={this.props.onItemChange}
                    onItemEditDone={this.props.onItemEditDone}
                    onItemDone={this.props.onItemDone}
                    onItemDelete={this.props.onItemDelete}
                    onItemDoneChange={this.props.onItemDoneChange}/>;
              }.bind(this))}
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

    onItemClick: function(item){
      if (item.state != "done"){
        item.state = "edit";
        this.setState({items: this.state.items});
      }
    },

    onItemChange: function(id, e){
      var item = _.findWhere(this.state.items, {id: id});
      item.text = e.target.value;
      this.setState({items: this.state.items});
    },

    onItemEditDone: function(id){
      var item = _.findWhere(this.state.items, {id: id});
      item.state = "active";
      this.setState({items: this.state.items});
    },

    onItemDone: function(id){
      var item = _.findWhere(this.state.items, {id: id});
      item.state = "done";
      this.setState({items: this.orderItems(this.state.items)});
    },

    onItemDoneChange: function(id, done){
      var item = _.findWhere(this.state.items, {id: id});
      item.state = done ? "done" : 'active';
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
          <div>
            <form className='form-inline' role='form' onSubmit={this.handleSubmit}>
              <div className='form-group'>
                <input
                  placeholder={new_item_placeholder}
                  className='form-control'
                  onChange={this.onChange}
                  value={this.state.text}/>
              </div>
              <button className='btn btn-primary'>Submit</button>
            </form>
            <TodoList items={this.state.items}
                onItemClick={this.onItemClick}
                onItemChange={this.onItemChange}
                onItemEditDone={this.onItemEditDone}
                onItemDone={this.onItemDone}
                onItemDelete={this.onItemDelete}
                onItemDoneChange={this.onItemDoneChange}/>
          </div>
        );
    }
});

$(function(){
    React.renderComponent(<TodoApp/>, document.getElementById('todo-app'));
});
