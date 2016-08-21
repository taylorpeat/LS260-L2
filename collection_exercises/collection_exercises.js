var users_template = Handlebars.compile($("#users").html());
    User = Backbone.Model.extend({
      url: "http://jsonplaceholder.typicode.com/users"
    }),
    Users = Backbone.Collection.extend({
      model: User,
      url: "http://jsonplaceholder.typicode.com/users",
      initialize: function() {
        this.on("sync sort", renderCollection);
      },
      parse: function(response) {
        response.forEach(function(user) {
          user.company_name = user.company.name;
          user.catchPhrase = user.company.catchPhrase;
          user.company_bs = user.company.bs;
          delete user.company;
        });
        return response;
      }
    }),
    exercise_users = new Users({});

exercise_users.create({
  email: "taylorpeat@hotmail.com",
  name: "Taylor Peat"
}, {
  success: function(model) {
    console.log(model.toJSON());
  }
});

exercise_users.fetch({
  success: function() {
    console.log(exercise_users.toJSON());
  }
});





 
function renderCollection() {
  $("body").html(users_template({ users: exercise_users.toJSON() }));
}