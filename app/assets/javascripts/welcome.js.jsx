/** @jsx React.DOM */
// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://coffeescript.org/

var new_item_placeholder = 'Add text here';

var TodoApp = React.createClass({
    getInitialState: function(){
      return {items: [], text: new_item_placeholder};
    },

    handleSubmit: function(e){
      e.preventDefault();
      var new_items = this.state.items.concat([this.state.text]);
      this.setState({text: new_item_placeholder, items: new_items});
    },

    onChange: function(e){
      this.setState({text: e.target.value});
    },

    render: function(){
        return (
          <div>
            <form onSubmit={this.handleSubmit}>
              <input onChange={this.onChange} value={this.state.text}/>
              <button>Submit</button>
            </form>
            <ul>
              {this.state.items.map(function(item){
                return <li>{item}</li>;
              })}
            </ul>
          </div>
        );
    }
});

$(function(){
    React.renderComponent(<TodoApp/>, document.getElementById('todo-app'));
});

