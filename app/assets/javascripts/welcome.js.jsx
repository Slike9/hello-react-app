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

    render: function(){
      return this.props.item.edit
        ? <li><form onSubmit={this.handleSubmit}><input value={this.props.item.text}
                     onChange={this.props.onItemChange.bind(null, this.props.item.id)}/></form></li>
        : <li onClick={this.props.onItemClick.bind(null, this.props.item)}> {this.props.item.text}</li>;
    }
});

var TodoList = React.createClass({
    render: function(){
        return (
          <ul>
              {this.props.items.map(function(item){
                return <TodoItem item={item} onItemClick={this.props.onItemClick}
                    onItemChange={this.props.onItemChange}
                    onItemEditDone={this.props.onItemEditDone}/>;
              }.bind(this))}
          </ul>);
    }
});

var TodoApp = React.createClass({
    getInitialState: function(){
      return {items: [], text: new_item_placeholder, counter: 0};
    },

    handleSubmit: function(e){
      e.preventDefault();
      var new_items = this.state.items.concat([{text: this.state.text, id: this.state.counter}]);
      this.setState({text: new_item_placeholder, items: new_items, counter: this.state.counter + 1});
    },

    onChange: function(e){
      this.setState({text: e.target.value});
    },

    onItemClick: function(item){
        item.edit = true;
        var newItems = Array.prototype.slice.apply(this.state.items);
        this.setState({items: newItems});
    },

    onItemChange: function(id, e){
        var newItems = Array.prototype.slice.apply(this.state.items);
        item = _.findWhere(newItems, {id: id});
        item.text = e.target.value;
        this.setState({items: newItems});
    },

    onItemEditDone: function(id){
        var newItems = Array.prototype.slice.apply(this.state.items);
        item = _.findWhere(newItems, {id: id});
        item.edit = false;
        this.setState({items: newItems});
    },

    render: function(){
        return (
          <div>
            <form onSubmit={this.handleSubmit}>
              <input onChange={this.onChange} value={this.state.text}/>
              <button>Submit</button>
            </form>
            <TodoList items={this.state.items}
                onItemClick={this.onItemClick}
                onItemChange={this.onItemChange}
                onItemEditDone={this.onItemEditDone}/>
          </div>
        );
    }
});

$(function(){
    React.renderComponent(<TodoApp/>, document.getElementById('todo-app'));
});

