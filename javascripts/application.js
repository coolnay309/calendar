$(function(){
    var Event = Backbone.Model.extend();
 
    var Events = Backbone.Collection.extend({
        model: Event,
        url: 'events'
    });

    var EventView = Backbone.View.extend({
        el: $('#eventDialog'),

        render: function() {
            alert(JSON.stringify(this));
            this.$el.dialog({
                modal: true,
                title: 'New Event',
                buttons: {'Cancel': this.close}
                
            });
            return this;
        },
        close: function() {
            alert(JSON.stringify(this));
            $(this).dialog('close');
        },
    });
 
    var EventsView = Backbone.View.extend({
        initialize: function(){
            //_.bindAll(this);
 
            this.collection.bind('reset', this.addAll);
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
                select: this.select
            });
        },
        addAll: function(){
            this.$el.fullCalendar('addEventSource', this.collection.toJSON());
        },

        select: function(startDate, endDate){
            new EventView().render();
        }
    });
 
    var events = new Events();
    new EventsView({el: $("#calendar"), collection: events}).render();
    events.fetch();
});
