var messageApi = Vue.resource('/students');
var messageApi3 = Vue.resource('/students/tables');
var messageApi2 = Vue.resource('/students/errors')
var eventBus = new Vue();

Vue.component('error-list',{
    template:
    '<div>'+
    '<template v-if="check===\'check\'">'+
        '<template align="center" v-if="ok===\'ok\'">'+
             '<div class="alert alert-success" role="alert" align="center">'+
                '<strong>Success. No errors.</strong>'+
             '</div>'+
        '</template>'+
        '<template align="center" v-else>'+
            '<div class="alert alert-danger" role="alert" align="center">'+
            '<strong>{{errors}}</strong>' +
            '</div>' +
        '</template>'+
    '</template>'+
    '</div>',
    data: function(){
        return {
            errors: '',
            check: 'check',
            ok: 'ok',
        }
    },
    created: function(){
        eventBus.$on("ok", (ea)=>{
            this.check = 'uncheck';
            setTimeout( () => messageApi2.get().then(result => {this.errors = result.bodyText;  this.check = 'check';if(this.errors == '') {this.ok = 'ok'} else {this.ok = 'notok'};}), 800);
        })
    },
    methods: {
        pause: function(ms)
        {
            var date = new Date();
            var curDate = null;
            do
            {
                curDate = new Date();
            }
            while(curDate-date < ms);
        },
    }
});

Vue.component('messages-form',{
    data: function() {
        return{
            text: '',
            errors:''
        }
    },
    template:
        '<div>'+
            '<p>'+
                '<div>' +
                    '<input type ="text" id="text1" placeholder="Write request" v-model="text"/>' +
                    '<input type ="button" id="buttrun" value="Enter" @click="save" @keyup.enter="save"/>' +
                '</div>'+
            '</p>'+
                 '<p>'+
                      '<input type ="button" id="button_req" value="SELECT" @click="select" />' +
                      '<input type ="button" id="button_req" value="INSERT" @click="insert" />' +
                      '<input type ="button" id="button_req" value="UPDATE" @click="update" />' +
                      '<input type ="button" id="button_req" value="DELETE" @click="delete_" />' +
                      '<input type ="button" id="button_req" value="ALTER" @click="alter" />' +
                      '<input type ="button" id="button_req" value="RENAME" @click="rename" />' +
                      '<input type ="button" id="button_req" value="DROP" @click="drop" />' +
                      '<input type ="button" id="button_req" value="CREATE" @click="create" />' +
                      '<input type ="button" id="button_req" value="TRUNCATE" @click="truncate" />' +
                 '</p>'+
        '</div>',
    methods:{
        save: function() {
            var message = { text: this.text };
            //messageApi.save({}, message);
            axios.post('/students', {
                text: this.text
            })
            this.text ='';
            eventBus.$emit("ok", message);
            //location = location;
        },
        select: function(){
            this.text = 'select  from ;';
        },
        insert: function(){
            this.text = 'insert into  () values ();';
        },
        update: function(){
            this.text = 'update  set  where ;';
        },
        delete_: function(){
            this.text = 'delete from  where ;';
        },
        alter: function(){
            this.text = 'alter table  add ;';
        },
        rename: function(){
            this.text = 'rename table ;';
        },
        drop: function(){
            this.text = 'drop table ;';
        },
        create: function(){
            this.text = 'create table  ();';
        },
        truncate: function(){
            this.text = 'truncate table  ;';
        },
    }
});

Vue.component('tables-list',{
    template:
    '<div><p align = "center">Список таблиц в БД</p><table align="center" border="1"><tr><th>Название</th></tr><tr v-for="message in messages"><td>{{message}}</td></tr></table></div>',
    data: function(){
        return {
            messages: []
        }
    },
    created: function(){
        this.messages =[];
        axios.get('/students/tables').then(response => (this.messages = response.data)).catch(function (error) {console.log(error);}).then(function (){});
        messageApi3.get().then(result => result.json().then(data => data.forEach(message => this.messages.push(message))));
        eventBus.$on("ok", (data)=>{
            this.messages =[];
            setTimeout( () => axios.get('/students/tables').then(response => (this.messages = response.data)).catch(function (error) {console.log(error);}).then(function (){}), 200)
        });
    }
});

Vue.component('string',{
    props: ['message'],
    template: '<p><span v-html="message"></span></p>',
});

Vue.component('messages-list',{
    template:
    '<div>'+

        '<messages-form align="center"/>' +
        '<p id="container">'+
            '<tables-list id="nav"/>'+
            '<string :message ="message" align="center" id="content"/>'+
        '</p>'+
    '</div>',
    data: function(){
        return {
            message: ''
        }
    },
    created: function(){
        axios.get('/students').then(response => (this.message = response.data)).catch(function (error) {console.log(error);}).then(function (){});
        eventBus.$emit("ok1", {});
        eventBus.$on("ok", (data)=>{
            setTimeout( () => axios.get('/students').then(response => (this.message = response.data)).catch(function (error) {console.log(error);}).then(function (){}), 200);
            eventBus.$emit("ok1", {})
        });
    }
});

var app = new Vue({
  el: '#app',
  template: '<messages-list/>',
});

var app2 = new Vue({
  el: '#app2',
  template: '<error-list id="footer"/>',
});



