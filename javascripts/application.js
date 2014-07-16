$(function(){
    var Event = Backbone.Model.extend();
 
    var Events = Backbone.Collection.extend({
        model: Event,
        url: 'events'
    });

    var EventView = Backbone.View.extend({
        el: $('#eventDialog'),

        initialize: function(){
            _.bindAll(this, 'close');
            _.bindAll(this, 'render');
            _.bindAll(this, 'save');
            _.bindAll(this, 'open');
        },

        render: function() {
            this.$el.dialog({
                modal: true,
                title: (this.model.isNew() ? 'New' : 'Edit') + ' Event',
                buttons: {'Ok': this.save, 'Cancel': this.close},
                open: this.open,
            });
            return this;
        },
        close: function() {
            this.$el.dialog('close');
        },

        open: function(){
            this.$('#title').val(this.model.get('title'));
            this.$('#color').val(this.model.get('color'));
        },        

        save: function(){
            this.model.set({'title': this.$('#title').val(), 'color': this.$('#color').val()});
            if (this.model.isNew()){
                this.collection.create(this.model, {success: this.close()});
            } else {
                this.model.save({}, {success: this.close()});
            }
        },
    });
 
    var EventsView = Backbone.View.extend({
        initialize: function(){
            _.bindAll(this, 'render');
            _.bindAll(this, 'addAll');
            _.bindAll(this, 'select');
            _.bindAll(this, 'addOne');
            _.bindAll(this, 'eventClick');
            _.bindAll(this, 'change');
            _.bindAll(this, 'eventDropOrResize');
            this.collection.bind('reset', this.addAll);
            this.collection.bind('add', this.addOne);
            this.collection.bind('change', this.change);
            this.eventView = new EventView();
        },
        render: function() {
            this.$el.fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,basicWeek,basicDay',
                    ignoreTimezone: false
                },
                selectable: true,
                selectHelper: true,
                editable: true,
                select: this.select,
                eventClick: this.eventClick,
                eventDrop: this.eventDropOrResize,
                eventResize: this.eventDropOrResize,
            });
        },

        eventClick: function(event){
            this.eventView.collection = this.collection;
            this.eventView.model = this.collection.where({title:event.title});
            this.eventView.render();
        },

        eventDropOrResize: function(fcEvent) {
            this.collection.get(fcEvent.id).save({start: fcEvent.start, end: fcEvent.end});
        },

        addAll: function(){
            this.$el.fullCalendar('addEventSource', this.collection.toJSON());
        },

        addOne: function(event){
            this.$el.fullCalendar('renderEvent', event.toJSON());
        },

        change: function(event){
            var fcEvent = this.$el.fullCalendar('clientEvents', event.get('id'))[0];
            fcEvent.title = event.get('title');
            fcEvent.color = event.get('color');
            this.$el.fullCalendar('updateEvent', fcEvent);
        },
        select: function(start, end){
            this.eventView.collection = this.collection;
            this.eventView.model = new Event({start: start, end: end});
            this.eventView.render();
        },
    });
 
    var events = new Events();
    new EventsView({el: $("#calendar"), collection: events}).render();
    events.fetch();
});
