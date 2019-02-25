var messageApi2 = Vue.resource('/students/errors')
var messageApi4 = Vue.resource('/students/attrib');
var messageApi = Vue.resource('/students');
var eventBus = new Vue();

Vue.component('tables-list',{
    template:
    '<div class="list1">' +
        '<p align = "center" class="paragraph">Список таблиц в БД</p>' +
        '<ul class="list">' +
            '<li v-for="message in messages" @click="listclick(message)">{{message}}</li>' +
        '</ul>' +
        '<hr size="3" color="black" class="lin">' +
        '<p align = "center" class="paragraph" style="margin-top: 0px; margin-bottom: 5px" v-show="curretntable != \'a\'">Атрибуты {{curretntable}}</p>' +
        '<button v-if="atrtib != \'\'" @click="all()" style="margin-left: 50px; margin-bottom: 5px; height: 20px; font-size: 10px" >Выбрать всё</button>'+
        '<ul class="list5">' +
            '<li v-for="message in atrtib" @click="attribclick(message)">{{message}}</li>' +
        '</ul>'+
    '</div>',
    data: function(){
        return {
            messages: [],
            atrtib: [],
            curretntable: '',
            currentatrib: ''
        }
    },
    created: function(){
        axios.get('/students/tables').then(response => (this.messages = response.data)).catch(function (error) {console.log(error);})
        eventBus.$on("ok", (data)=>{
            this.atrtib = [];
            this.messages=[];
            setTimeout( () =>axios.get('/students/tables').then(response => (this.messages = response.data)).catch(function (error) {console.log(error);}).then(function (){}), 400)
            this.listclick(this.curretntable);
        });
    },
    methods: {
        listclick: function (message) {
            this.curretntable = message;
            var text = {text: this.curretntable };

            this.atrtib=[];
            setTimeout( () => messageApi4.save({} , '\"'+this.curretntable + '\"').then(result => result.json().then(data => data.forEach(message => this.atrtib.push(message)))), 150);
            eventBus.$emit("table", this.curretntable);
        },
        attribclick: function (message) {
            this.currentatrib = message;
            eventBus.$emit("atr", this.currentatrib);
        },
        all: function () {
            eventBus.$emit("atr_all", this.atrtib);
        }
    }
});

Vue.component('string',{
    props: ['message'],
    template: '<p><span  v-html="message"></span></p>',
});

Vue.component('messages-list',{
    template:
    '<div>'+
        '<p align="center" id="container">'+
            '<string :message ="message" id="contentt"/>'+
        '</p>'+
    '</div>',
    data: function(){
        return {
            message: ''
        }
    },
    created: function(){
        messageApi.get().then(result => {this.message = result.bodyText;});
        eventBus.$on("ok", (data)=>{
            setTimeout( () => messageApi.get().then(result => {this.message = result.bodyText;}), 250)
        })
    }
});

var app2 = new Vue({
  el: '#app2',
  template: '<messages-list/>',
});

var app = new Vue({
  el: '#app',
  template: '<tables-list/>',
});

Vue.component('page9', {
    props: ['page'],
    data: function() {
        return{
            text: ''
        }
    },
    template:
    '<div align="center" class="delttun">' +
        '<input type="text" placeholder="Таблица" id="texttrun" v-model="text">' +
        '<input type="button" id="buttrun" value="Очистить" @click="request">' +
    '</div>',
    methods:{
        request: function () {
            var str = 'truncate table ' + '\"' + this.text + '\"';
            messageApi.save({}, str);
            eventBus.$emit("ok", {});
            this.text = '';
        }
    },
    created: function(){
        eventBus.$on("table", (data)=>{
            if(this.page === 9) this.text = data;
            else this.text ='';
    });
    },
});

Vue.component('page8', {
    props: ['page'],
    data: function() {
        return{
            text: ''
        }
    },
    template:
        '<div align="center" class="delttun">' +
        '<input type="text" placeholder="Таблица" id="texttrun" v-model="text">' +
        '<input type="button" id="buttrun" value="Удалить" @click="request">' +
        '</div>',
    methods:{
        request: function () {
            var str = 'drop table ' + '\"' +this.text + '\"';
            messageApi.save({}, str);
            eventBus.$emit("ok", {});
            this.text = '';
        }
    },
    created: function(){
        eventBus.$on("table", (data)=>{
            if(this.page === 8) this.text = data;
        else this.text ='';
    });
    },
});

Vue.component('page7', {
    props: ['page'],
    data: function() {
        return{
            text: '',
            text1: ''
        }
    },
    template:
        '<div align="center" class="delttun">' +
        '<strong> Изменить </strong>' +
        '<input type="text" placeholder="Название таблицы" id="texttrun1" v-model="text">' +
        '<strong> на </strong>' +
        '<input type="text" placeholder="Новое название" id="texttrun1" v-model="text1">' +
        '<input type="button" id="buttrun1" value="Переименовать" @click="request">' +
        '</div>',
    methods:{
        request: function () {
            var str = 'alter table ' + '\"' + this.text + '\"' + ' RENAME TO ' + '\"' + this.text1+ '\"';
            messageApi.save({}, str);
            eventBus.$emit("ok", {});
            this.text = '';
            this.text1 = '';
        }
    },
    created: function(){
        eventBus.$on("table", (data)=>{
            if(this.page === 7) this.text = data;
            else {this.text =''; this.text ='';}
        })
    }
});

Vue.component('page6', {
    props: ['page'],
    data: function() {
        return{
            text: '',
            text4: '1',
            text5: '',
            option: '',
            option2: 'INT',
            text1: '',
            text2: '',
            options2: [
                { text: 'SERIAL' },
                { text: 'VARCHAR', },
                { text: 'INT',  },
                { text: 'FLOAT',  },
                { text: 'DOUBLE',  },
                { text: 'TIME',  },
                { text: 'TEXT',  }
            ],
            options: [
                { data: 'drop column', text: 'Удалить'},
                { data: 'rename column', text: 'Переименовать' },
                { data: 'add column', text: 'Добавить'}
            ]
        }
    },
    watch:{
        option: function () {
                //if (option != 'VARCHAR') value.char='0';
        }
    },
    template:
        '<div align="center" class="delttun">' +
            '<p><select v-model="option" id="texttrun2">' +
                '<option v-for="option in options" v-bind:value="option" >{{option.text}}</option>'+
            '</select> столбец</p>' +
            '<div v-show="option.text === \'Добавить\'">' +
                '<strong> Добавить в </strong>' +
                '<input type="text" placeholder="Таблица" id="texttrun2" v-model="text1">' +
                '<strong style="margin-left: 5px"></strong>' +
                '<input type="text" placeholder="Название атрибута" id="texttrun2" v-model="text5">' +
                '<strong style="margin-left: 5px"></strong>' +
                '<select v-model="option2" id="texttrun2">' +
                    '<option v-for="option in options2" v-bind:value="option.text">{{option.text}}</option>'+
                '</select>' +
                '<strong style="margin-left: 5px"></strong>' +
                '<input v-show="option2===\'VARCHAR\'" id="texttrun4" onkeypress="return false" min="1" max="100" v-model="text4" type="number"/>'+
                '<button type="button" id="buttrun1" @click="request">{{option.text}}</button>' +
            '</div>' +
            '<div v-show="option.text === \'Удалить\'">' +
                '<strong> Удалить из </strong>' +
                '<input type="text" placeholder="Таблица" id="texttrun2" v-model="text1">' +
                '<strong style="margin-left: 5px"></strong>' +
                '<input type="text" placeholder="Название атрибута" id="texttrun2" v-model="text">' +
                '<button type="button" id="buttrun1" @click="request">{{option.text}}</button>' +
            '</div>' +
            '<div v-show="option.text === \'Переименовать\'">' +
                '<strong> В таблице </strong>' +
                '<input type="text" placeholder="Таблица" id="texttrun2" v-model="text1">' +
                '<strong> переимновать </strong>' +
                '<input type="text" placeholder="Название атрибута" id="texttrun2" v-model="text">' +
                '<strong> на </strong>' +
                '<input type="text" placeholder="Название атрибута" id="texttrun2" v-model="text2">' +
                '<button type="button" id="buttrun1" @click="request">{{option.text}}</button>' +
            '</div>' +
        '</div>',
    methods:{
        request: function () {
            var str = 'alter table ' + '\"' + this.text1 +'\" ';
            if(this.option.text === 'Удалить'){
                str = str + this.option.data + ' \"' + this.text +'\"';
            }
            if(this.option.text === 'Переименовать'){
                str = str + this.option.data + ' \"' + this.text +'\" to \"' + this.text2 + '\"';
            }
            if(this.option.text === 'Добавить'){
                str = str + this.option.data + ' \"' + this.text5 + '\" ' + this.option2;
                if (this.option2 == "VARCHAR") str = str + "(" + this.text4 +")";
            }
            this.text = '';
            this.text4='';
            this.text5= '';
            this.option='';
            this.option2= '';
            this.text1= '';
            this.text2= '';
            console.log(str);
            messageApi.save({}, str);
            eventBus.$emit("ok", {});
        },
        up: function(text) {
            console.log(text);
            this.text = '';
            this.text1 = '';
            this.text2 = '';
        }
    },
    created: function(){
        eventBus.$on("table", (data)=>{
            if(this.page === 6) { this.text1 = data ;}
            else this.text1 ='';
        })
        eventBus.$on("atr", (data)=>{
            if(this.page === 6) this.text = data;
            else this.text ='';
        })
    }
});

Vue.component('page5', {
    props: ['page'],
    data: function() {
        return{
            text: '',
            text1: ''
        }
    },
    template:
        '<div align="center" class="delttun">' +
        '<strong> Удалить из  </strong>' +
        '<input type="text" placeholder="Название таблицы" id="texttrun1" v-model="text">' +
        '<strong> все где </strong>' +
        '<input type="text" placeholder="Условие" id="texttrun1" v-model="text1">' +
        '<input type="button" id="buttrun1" value="Удалить" @click="request">' +
        '<i ><p class="delttun">* Для избежания ошибки, атрибуты, названия которых совпадают с зарезервироваными словами SQl, оборачивать в двойные ковычки("")</p></i>'+
        '</div>',
    methods:{
        request: function () {
            var str = 'delete from ' + '\"' + this.text + '\"' + ' where ' + this.text1;
            messageApi.save({}, str);
            eventBus.$emit("ok", {});
            this.text = '';
            this.text1 = '';
        }
    },
    created: function(){
        eventBus.$on("table", (data)=>{
            if(this.page === 5) this.text = data;
            else {this.text =''; this.text ='';}
        })
    }
});

Vue.component('page4', {
    props: ['page'],
    data: function() {
        return{
            n_atr: 1,
            text: '',
            atribs: []
        }
    },
    template:
        '<div align="center" class="delttun">' +
        '<p>' +
            '<strong>Название таблицы  </strong>' +
            '<input type="text" placeholder="Название" id="texttrun2" v-model="text">' +
            '<input type="button" id="buttrun1" value="Добавить" @click="request">' +
        '</p>' +
            '<strong style="float: left; margin-left: 20px">Выбранные атрибуты: </strong>' +
            '<div style="clear: left; margin-left: 25px; overflow-y: auto" v-for="atr in atribs">' +
                '<a style="float: left"> {{atr.data}}  </a>' +
                '<input  type="text" style="float: left; margin-left: 5px" v-model="atr.text" placeholder="Введите данные" id="texttrun2" />' +
                '<button type="button" @click="delFormElements(atr.id)" class="close">Х</button>'+
            '</div>'+
        '</div>',
    methods:{
        request: function () {
            var str = 'insert into ' + '\"'+this.text+'\"' + '(';
            this.text='';
            len = this.atribs.length;
            i = 0;
            this.atribs.forEach(function (atribs) {
                str = str +'\"'+ atribs.data + '\" '
                i++;
                if(i!=len) str = str + ','
            });
            str = str +') values (';
            i = 0;
            this.atribs.forEach(function (atribs) {
                str = str +'\''+ atribs.text + '\'';
                i++;
                if(i!=len) str = str + ','
            });
            str = str + ')';
            this.n = 1;
            console.log(str);
            messageApi.save({}, str);
            eventBus.$emit("ok", {});
        },
        addFormElement: function(){
            this.n++;
            this.fields.push({id: this.n, data: ''});
        },
        delFormElement: function (field) {
            this.fields.splice(field-1,1);
            for(index = field - 1, len= this.fields.length; index<len;index++)
            {
                this.fields[index].id=index+1;
            }
            this.n--;
        },
        delFormElements: function (art) {
            this.atribs.splice(art-1,1);
            for(index = art - 1, len= this.atribs.length; index<len;index++)
            {
                this.atribs[index].id=index+1;
            }
            this.n_atr--;
        }
    },
    created: function(){
        eventBus.$on("table", (data)=>{
            if(this.page === 4) { this.text = data ; this.atribs =[];}
            else this.text1 ='';
        })
        eventBus.$on("atr", (data)=>{
            if(this.page === 4) {
                check = true;
                field = {id: this.n_atr, data: data, text: '' };
                this.atribs.forEach(function (value) { if(value.data === field.data) check=false;});
                if (check){this.atribs.push(field); this.n_atr++;}
            }
        })
        eventBus.$on("atr_all", (data)=>{
            this.atribs = [];
            this.n_atr = 1;
            if(this.page === 4) {
                for (index = 0; index < data.length;index++){
                    object = {id: this.n_atr, data: data[index], text: ''};
                    this.atribs.push(object);
                    this.n_atr++;
                }
            }
        })
    }
});

Vue.component('page3', {
    props: ['page'],
    data: function() {
        return{
            text: '',
            text1: '',
            text2: ''
        }
    },
    template:
        '<div align="center" class="delttun">' +
        '<strong> Обновить данные из </strong>' +
        '<input type="text" placeholder="Название таблицы" id="texttrun2" v-model="text">' +
        '<strong> в атрибуте </strong>' +
        '<input type="text" placeholder="Название атрибута" id="texttrun2" v-model="text1">' +
        '<strong> Условие </strong>' +
        '<input type="text" placeholder="Условие" id="texttrun2" v-model="text2">' +
        '<input type="button" id="buttrun1" value="Обновить" @click="request">' +
        '<i ><p class="delttun">* При написании условия, заключайте название атрибутов в " "</p></i>'+
        '</div>',
    methods:{
        request: function () {
            var str = 'update ';
            str = str + '\"' + this.text + '\"' + ' set ' + '\"' + this.text1 + '\" ' + this.text2;
            console.log(str);
            messageApi.save({}, str);
            eventBus.$emit("ok", {});
            this.text = '';
            this.text1 = '';
            this.text2 = '';
        }
    },
    created: function(){
        eventBus.$on("atr", (data)=>{
            if(this.page === 3) this.text1 = data;
            else this.text1 ='';
        })
        eventBus.$on("table", (data)=>{
            if(this.page === 3) { this.text = data; this.text1 =''}
            else this.text ='';
        })
    }
});

Vue.component('page2', {
    props: ['page'],
    data: function() {
        return{
            n: 1,
            text: '',
            fields: [],
            options: [
                { text: 'SERIAL' },
                { text: 'VARCHAR', },
                { text: 'INT',  },
                { text: 'FLOAT',  },
                { text: 'DOUBLE',  },
                { text: 'TIME',  },
                { text: 'TEXT',  }
            ]
        }
    },
    watch:{
        fields: function () {
            this.fields.forEach(function (value) {
                if (value.select != 'VARCHAR') value.char='0';
            })
        }
    },
    template:
        '<div align="center" class="delttun">' +
            '<p>' +
                '<strong>Название таблицы  </strong>' +
                '<input type="text" placeholder="Название" id="texttrun2" v-model="text">' +
                '<input type="button" id="buttrun1" value="Создать" @click="request">' +
            '</p>' +
        '<p style="float: left; margin-left: 40px"><strong>Атрибуты</strong></p>' +
        '<div  class="listadd">' +
        '<div v-for="field in fields" >'+
        '<input  type="text" v-model="field.field" placeholder="Название атрибута" id="texttrun2" class="listaddrow"/>' +
        '<select v-model="field.select"" id="selecttrun2" >' +
        '  <option v-for="option in options" >' +
        '{{ option.text }}' +
        '  </option>' +
        '</select>' +
        '<input v-show="field.select===\'VARCHAR\'" id="texttrun3" onkeypress="return false" min="1" max="100" v-model="field.char" type="number"/>'+
        '<button v-if="field.id != 1 " type="button" @click="delFormElement(field.id)" class="close">Х</button>'+
        '</div>'+
        '<button align="center" type="button" id="listaddbutton" @click="addFormElement">+</button>'+
        '</div>'+
        '</div>',
    methods:{
        request: function () {
            var str = 'create table ' + '\"'+this.text+'\"' + '(';
            this.text='';
            len = this.fields.length;
            this.fields.forEach(function (field) {
                str = str +'\"'+ field.field + '\" '+ field.select ;
                if (field.char!='0') str = str + '(' + field.char + ')';
                if (field.id != len ) str = str + ','
            });
            this.fields = [];
            this.text='';
            this.fields.push({id: this.n, data: '', select: this.options[2].text, char: '0'});
            this.n = '1';
            str = str +')';
            console.log(str);
            messageApi.save({}, str);
            eventBus.$emit("ok", {});
        },
        addFormElement: function(){
            this.n++;
            this.fields.push({id: this.n, data: '', select: this.options[2].text, char: '0'});
        },
        delFormElement: function (field) {
            this.fields.splice(field-1,1);
            for(index = field - 1, len= this.fields.length; index<len;index++)
            {
                this.fields[index].id=index+1;
            }
            this.n--;
        }
    },
    created: function(){
        this.fields.push({ id: this.n, field:'', select:this.options[1].text, char: '1' });
    }
});

Vue.component('page1', {
    props: ['page'],
    data: function() {
        return{
            text: '',
            all: '*',
            text1: '',
            text2: ''
        }
    },
    template:
        '<div align="center" class="delttun">' +
        '<strong> Отобразить </strong>' +
        '<input type="text" placeholder="Выборка" id="texttrun2" v-model="text">' +
        '<strong> из таблиц(ы) </strong>' +
        '<input type="text" placeholder="Таблица" id="texttrun2" v-model="text1">' +
        '<strong> где </strong>' +
        '<input type="text" placeholder="Условия" id="texttrun2" v-model="text2">' +
        '<input type="button" id="buttrun1" value="Выбрать" @click="request">' +
        '<i ><p class="delttun">* Для вывода таблицы полностью, оставьте поле "Выборка" пустым</p></i>'+
        '</div>',
    methods:{
        request: function () {
            var str = 'select ';
            if (this.text==='') str = str + this.all +' from ' + this.text1;
            else str = str +  this.text + ' from ' + this.text1;
            if(this.text2!='') str = str + ' where ' + this.text2;
            messageApi.save({}, str);
            eventBus.$emit("ok", {});
            this.text = '';
            this.text1 = '';
            this.text2 = '';
        }
    },
    created: function(){
        eventBus.$on("table", (data)=>{
            if(this.page === 1) { if(this.text1 === '')this.text1 = '\"'+ data + '\"'; else { if(this.text1.indexOf(data)===-1)this.text1 = this.text1+',' + '\"'+ data + '\"'}}
            else this.text1 ='';
        })
        eventBus.$on("atr", (data)=>{
            if(this.page === 1) { if(this.text === '')this.text = data; else { if(this.text.indexOf(data)===-1)this.text = this.text+',' + data}}
            else this.text ='';
        })
    }
});

Vue.component('error-list',{
    template:
        '<div >'+
            '<template v-if="check===\'check\'">'+
                '<template align="center" v-if="ok===\'ok\'">'+
                    '<div class="alert alert-success" role="alert" align="center" style="margin-bottom: 0px">'+
                        '<strong>Success. No errors.</strong>'+
                    '</div>'+
                '</template>'+
                '<template align="center" v-else>'+
                    '<div class="alert alert-danger" role="alert" align="center" style="margin-bottom: 0px">'+
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
            setTimeout( () => messageApi2.get().then(result => {this.errors = result.bodyText;  this.check = 'check';if(this.errors == '') {this.ok = 'ok'} else {this.ok = 'notok'};}), 800);
        })
    }
});

Vue.component('space',{
    data: function () {
        return{
            page: ''
        }
    },
    template:
        '<div class="con">' +
            '<div v-if="page === \'\'" class="con">' +
                '<h3 align="center" class="delttun" >Главная страница</h3>' +
            '</div>' +
            '<div v-if="page === 1" class="con">' +
                '<h3 align="center" class="delttun" >Вывод данных</h3>' +
                '<page1 :page="page"/>' +
            '</div>' +
            '<div v-if="page === 2" class="con">' +
                '<h3 align="center" class="delttun" >Создание таблицы</h3>' +
                '<page2 :page="page"/>' +
            '</div>' +
            '<div v-if="page === 3" class="con">' +
                '<h3 align="center" class="delttun">Обновить данные</h3>' +
                '<page3 :page="page"/>' +
            '</div>' +
            '<div v-if="page === 4" class="con">' +
                '<h3 align="center" class="delttun">Добавление данных</h3>' +
                '<page4 :page="page"/>' +
            '</div>' +
            '<div v-if="page === 5" class="con">' +
                '<h3 align="center" class="delttun">Удаление данных</h3>' +
                '<page5 :page="page"/>' +
            '</div>' +
            '<div v-if="page === 6" class="con">' +
                '<h3 align="center" class="delttun">Изменение атрибута</h3>' +
                '<page6 :page="page"/>' +
            '</div>' +
            '<div v-if="page === 7" class="con">' +
            '<h3 align="center" class="delttun">Переименование таблицы</h3>' +
                '<page7 :page="page"/>' +
            '</div>' +
            '<div v-if="page === 8" class="con">' +
                '<h3 align="center" class="delttun">Удаление таблицы</h3>' +
                '<page8 :page="page"/>' +
            '</div>' +
            '<div v-if="page === 9" class="con">' +
                '<h3 align="center" class="delttun">Очистка таблицы</h3>' +
                '<page9 :page="page"/>' +
            '</div>' +
        '</div>',
    created: function(){
        eventBus.$on("pages", (data)=>{
            this.page = data;
        });
    },
});

Vue.component('buttons',{
    data: function() {
      	return{
      		btnstate:'',
      	}
    },
    template:
    '<div>'+
        '<div><hr id="line"></div>' +
        '<input type ="button" class="buttonwin" value="Вывести данные" @click="btnstate = \'btn1\';insert()" :class="{active: btnstate === \'btn1\' }"/>' +
        '<input type ="button" class="buttonwin" value="Создать таблицу" @click="btnstate = \'btn2\'; create()" :class="{active: btnstate === \'btn2\' }" />' +
        '<input type ="button" class="buttonwin" value="Обновить данные" @click="btnstate = \'btn3\'; update()" :class="{active: btnstate === \'btn3\' }" />' +
        '<input type ="button" class="buttonwin" value="Добавить данные" @click="btnstate = \'btn4\'; add()" :class="{active: btnstate === \'btn4\' }"/>' +
        '<input type ="button" class="buttonwin" value="Удалить данные" @click="btnstate = \'btn5\'; del()" :class="{active: btnstate === \'btn5\' }"/>' +
        '<input type ="button" class="buttonwin" value="Изменить атрибуты" @click="btnstate = \'btn6\'; attrib()" :class="{active: btnstate === \'btn6\' }"/>' +
        '<input type ="button" class="buttonwin" value="Изменить наз. таблицы" @click="btnstate = \'btn7\'; change_name()" :class="{active: btnstate === \'btn7\' }"/>' +
        '<input type ="button" class="buttonwin" value="Удалить таблицу" @click="btnstate = \'btn8\'; del_table()" :class="{active: btnstate === \'btn8\' }"/>' +
        '<input type ="button" class="buttonwin" value="Очистить таблицу" @click="btnstate = \'btn9\'; truncate()" :class="{active: btnstate === \'btn9\' }"/>' +
        '<div><hr id="line1"></div>' +
    '</div>',
    methods:{
        insert: function(){
            eventBus.$emit("pages", 1);
        },
        create: function(){
            eventBus.$emit("pages", 2);
        },
        update: function(){
            eventBus.$emit("pages", 3);
        },
        add: function(){
            eventBus.$emit("pages", 4);
        },
        del: function(){
            eventBus.$emit("pages", 5);
        },
        attrib: function(){
            eventBus.$emit("pages", 6);
        },
        change_name: function(){
            eventBus.$emit("pages", 7);
        },
        del_table: function(){
            eventBus.$emit("pages", 8);
        },
        truncate: function(){
            eventBus.$emit("pages", 9);
        }
    }
});

var app3 = new Vue({
  el: '#app3',
  template: '<buttons/>'
});

var app4 = new Vue({
    el: '#app4',
    template: '<space/>'
});

var app5 = new Vue({
    el: '#app5',
    template: '<error-list/>',
});