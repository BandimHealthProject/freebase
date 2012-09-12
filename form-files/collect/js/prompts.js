'use strict';

define(['mdl','database','opendatakit','controller','backbone','handlebars','promptTypes','builder','zepto','underscore','text','templates/compiledTemplates'],
function(mdl, database, opendatakit, controller, Backbone, Handlebars, promptTypes, builder, $, _) {

Handlebars.registerHelper('localize', function(textOrLangMap, options) {
    if(_.isUndefined(textOrLangMap)) {
        return 'undefined';
    }
    if(_.isString(textOrLangMap)) {
        return new Handlebars.SafeString(textOrLangMap);
    }
    var locale = mdl.qp.formLocale.value;
    if( locale in textOrLangMap ){
        return new Handlebars.SafeString(textOrLangMap[locale]);
    } else if( 'default' in textOrLangMap ){
        return new Handlebars.SafeString(textOrLangMap['default']);
    } else {
        alert("Could not localize object. See console:");
        console.error("Non localizable object:");
        console.error(textOrLangMap);
    }
});

/**
 * Helper function for replacing variable refrences
 **/
Handlebars.registerHelper('substitute', function(options) {
    var template = Handlebars.compile(options.fn(this));
    return template(database.mdl.data);
});

promptTypes.base = Backbone.View.extend({
    className: "current",
    type: "base",
    required: false,
    database: database,
    //renderContext is a dynamic object to be passed into the render function.
    renderContext: {},
    initialize: function() {
        this.initializeTemplate();
        this.initializeRenderContext();
        this.afterInitialize();
    },
    initializeTemplate: function() {
        //if (this.template != null) return;
        var that = this;
        if(this.templatePath){
            requirejs(['text!'+this.templatePath], function(source) {
                that.template = Handlebars.compile(source);
            });
        }
    },
    isInitializeComplete: function() {
        return (this.template != null);
    },
    initializeRenderContext: function() {
        //We don't want to modify the top level render context.
        this.renderContext = Object.create(this.renderContext);
        this.renderContext.label = this.label;
        this.renderContext.name = this.name;
        this.renderContext.disabled = this.disabled;
        this.renderContext.image = this.image;
        this.renderContext.audio = this.audio;
        this.renderContext.video = this.video;
        this.renderContext.hide = this.hide;
    },
    afterInitialize: function() {},
    onActivate: function(readyToRenderCallback) {
        readyToRenderCallback();
    },
    template: Handlebars.templates.text, //Make "Override me" template
    render: function() {
        console.log(this.renderContext); 
        this.$el.html(this.template(this.renderContext));
        return this;
    },
    //Stuff to be added
    baseValidate: function(isMoveBackward, context) {
        var that = this;
        var defaultContext = {
            success: function() {},
            failure: function() {}
        };
        context = $.extend(defaultContext, context);

        function callback(value) {
            if (that.required) {
                that.valid = value !== '';
            }
            else {
                that.valid = true;
            }
            if (that.valid) {
                context.success();
            }
            else {
                context.failure();
            }
        }
        if ('newValue' in context) {
            callback(context.newValue);
        }
        else {
            callback(that.getValue());
        }
    },
    validate: function(isMoveBackward, context) {
        this.baseValidate(isMoveBackward, context);
    },
    getValue: function() {
        return database.getDataValue(this.name);
    },
    setValue: function(value, onSuccessfulSave) {
        // NOTE: data IS NOT updated synchronously. Use callback!
        var that = this;
        database.setData(that.name, that.datatype, value, onSuccessfulSave);
    },
    beforeMove: function(continuation) {
        continuation();
    },
    computePreviousPrompt: function(continuation) {
        continuation(null);
    },
    computeNextPrompt: function(continuation) { // TODO: do we need omitPushOnReturnStack flag here?
        //console.log("computeNextPrompt: beginning ms: " + (+new Date()) + " page: " + this.name);
        var that = this;
        if ('nextPromptName' in this) {
            continuation(controller.getPromptByName(that.nextPromptName));
        }
        else if (this.promptIdx + 1 < controller.prompts.length) {
            continuation(controller.prompts[this.promptIdx + 1]);
        }
        else {
            continuation(null);
        }
    },
    getCallback: function(actionPath) {
        alert('getCallback: Unimplemented: ' + actionPath);
    },
    /*
    registerChangeHandlers: function() {
        // TODO: code that is executed after all page prompts are inserted into the DOM.
        // This code would, e.g., handle value-change events to propagate changes across
        // a page (e.g., update calculated fields).
    },
    */
    validationFailedAction: function(isMoveBackward) {
        alert(this.validationFailedMessage);
    },
    requiredFieldMissingAction: function(isMovingBackward) {
        alert(this.requiredFieldMissingMessage);
    }

});
promptTypes.opening = promptTypes.base.extend({
    type: "opening",
    hideInHierarchy: true,
    template: Handlebars.templates.opening,
    templatePath: "templates/opening.handlebars",
    onActivate: function(readyToRenderCallback) {
        var formLogo = _.find(this.form.settings, function(setting){
            return setting.name==='formLogo'
        });
        if(formLogo){
            this.renderContext.headerImg = formLogo.param;
        }
        readyToRenderCallback();
    },
    events: {
        "click .editInstances": "editInstances"
    },
    editInstances: function(){
        controller.gotoPromptName('_instances', [], true);
    },
    renderContext: {
        formName: mdl.qp.formName.value,
        instanceName: mdl.qp.instanceName.value,
        headerImg: collect.baseDir + 'img/form_logo.png',
        backupImg: collect.baseDir + 'img/backup.png',
        advanceImg: collect.baseDir + 'img/advance.png'
    }
});
promptTypes.json = promptTypes.base.extend({
    type:"json",
    hideInHierarchy: true,
    valid: true,
    templatePath: "templates/json.handlebars",
    onActivate: function(readyToRenderCallback) {
        var that = this;
        database.getAllData(function(tlo) {
            if ( JSON != null ) {
                that.renderContext.value = JSON.stringify(tlo,null,2);
            } else {
                that.renderContext.value = "JSON Unavailable";
            }
            readyToRenderCallback({enableNavigation: false});
        });
    }
});
promptTypes.finalize = promptTypes.base.extend({
    type:"finalize",
    hideInHierarchy: true,
    valid: true,
    templatePath: "templates/finalize.handlebars",
    events: {
        "click .save-btn": "saveIncomplete",
        "click .final-btn": "saveFinal"
    },
    renderContext: {
        formName: mdl.qp.formName.value,
        instanceName: mdl.qp.instanceName.value,
        headerImg: collect.baseDir + 'img/form_logo.png',
    },
    onActivate: function(readyToRenderCallback) {
        var that = this;
        database.getAllData(function(tlo) {
            readyToRenderCallback({enableForwardNavigation: false});
        });
    },
    saveIncomplete: function(evt) {
        database.save_all_changes(false, function() {
            // TODO: call up to Collect to report completion
        });
    },
    saveFinal: function(evt) {
        database.save_all_changes(true, function() {
            // TODO: call up to Collect to report completion
        });
        
    }
});
promptTypes.instances = promptTypes.base.extend({
    type:"instances",
    hideInHierarchy: true,
    valid: true,
    template: Handlebars.templates.instances,
    templatePath: "templates/instances.handlebars",
    events: {
        "click .openInstance": "openInstance",
        "click .deleteInstance": "deleteInstance"
    },
    onActivate: function(readyToRenderCallback) {
        var that = this;
        database.withDb(function(transaction) {
            var ss = database.getAllFormInstancesStmt();
            transaction.executeSql(ss.stmt, ss.bind, function(transaction, result) {
                that.renderContext.instances = [];
                console.log('test');
                for ( var i = 0 ; i < result.rows.length ; i+=1 ) {
                    that.renderContext.instances.push(result.rows.item(i));
                }
            });
        }, function(error) {
            console.log("populateInstanceList: failed");
        }, function() {
            readyToRenderCallback({showHeader: false, enableNavigation:false});
        });
    },
    openInstance: function(evt) {
        opendatakit.openNewInstanceId($(evt.target).attr('id'));
    },
    deleteInstance: function(evt){
        var that = this;
        database.delete_all(mdl.qp.formId.value, $(evt.target).attr('id'), function() {
            that.onActivate(function(){that.render();});
        });
    }
});
promptTypes.hierarchy = promptTypes.base.extend({
    type:"hierarchy",
    hideInHierarchy: true,
    valid: true,
    template: Handlebars.templates.hierarchy,
    events: {
    },
    onActivate: function(readyToRenderCallback) {
        this.renderContext.prompts = controller.prompts;
        readyToRenderCallback({showHeader: false, showFooter: false});
    }
});
promptTypes.repeat = promptTypes.base.extend({
    type: "repeat",
    valid: true,
    template: Handlebars.templates.repeat,
    events: {
        "click .openInstance": "openInstance",
        "click .deleteInstance": "deleteInstance",
        "click .addInstance": "addInstance"
    },
    onActivate: function(readyToRenderCallback) {
        var that = this;
        var subsurveyType = this.param;
        database.withDb(function(transaction) {
            //TODO: Make statement to get all subsurveys with this survey as parent.
            var ss = database.getAllFormInstancesStmt();
            transaction.executeSql(ss.stmt, ss.bind, function(transaction, result) {
                that.renderContext.instances = [];
                console.log('test');
                for ( var i = 0 ; i < result.rows.length ; i+=1 ) {
                    that.renderContext.instances.push(result.rows.item(i));
                }
            });
        }, function(error) {
            console.log("populateInstanceList: failed");
        }, function() {
            readyToRenderCallback();
        });
    },
    openInstance: function(evt) {
        var instanceId = $(evt.target).attr('id');
    },
    deleteInstance: function(evt) {
        var instanceId = $(evt.target).attr('id');
    },
    addInstance: function(evt) {
        //TODO: Launch new instance of collect
    }
});
promptTypes.select = promptTypes.base.extend({
    type: "select",
    datatype: "text",
    template: Handlebars.templates.select,
    templatePath: "templates/select.handlebars",
    events: {
        "change input": "modification"
    },
    // TODO: choices should be cloned and allow calculations in the choices
    // perhaps a null 'name' would drop the value from the list of choices...
    // could also allow calculations in the 'checked' and 'value' fields.
    modification: function(evt) {
        var that = this;
        console.log("select modification");
        console.log(this.$('form').serializeArray());
        var value = this.$('form').serializeArray();
        var saveValue = (value == null) ? null : JSON.stringify(value);
        // TODO: broken for multiselect -- pretty sure we don't want to serialize array to db    
        this.setValue(saveValue, function() {
            that.renderContext.value = value;
            that.renderContext.choices = _.map(that.renderContext.choices, function(choice) {
                if ( value != null ) {
                    // NOTE: for multi-select
                    var matchingValue = _.find(that.renderContext.value, function(value){
                        return choice.name === value.name;
                    });
                    choice.checked = (matchingValue != null);
                } else {
                    choice.checked = false;
                }
                return choice;
            })
            that.render();
        });
    },
    onActivate: function(readyToRenderCallback) {
        var that = this;
        if(this.param in this.form.choices){
            that.renderContext.choices = this.form.choices[this.param];
        }
        var saveValue = that.getValue();
        that.renderContext.value = (saveValue == null) ? null : JSON.parse(saveValue);
        for (var i = 0 ; i < that.renderContext.choices.length ; ++i ) {
            var choice = that.renderContext.choices[i];
            if ( that.renderContext.value != null ) {
                // NOTE: for multi-select
                var matchingValue = _.find(that.renderContext.value, function(value){
                    return choice.name === value.name;
                });
                that.renderContext.choices[i].checked = (matchingValue != null);
            } else {
                that.renderContext.choices[i].checked = false;
            }
        }
        readyToRenderCallback();
    }
});
promptTypes.dropdownSelect = promptTypes.base.extend({
    type: "dropdownSelect",
    template: Handlebars.templates.dropdownSelect,
    templatePath: "templates/dropdownSelect.handlebars",
    events: {
        "change select": "modification"
    },
    modification: function(evt) {
        console.log("select modification");
        var that = this;
        database.putData(this.name, "string", that.$('select').val(), function() {
            that.render();
        });
    },
    render: function() {
        var value = this.getValue();
        console.log(value);
        var context = {
            name: this.name,
            label: this.label,
            choices: _.map(this.choices, function(choice) {
                if (_.isString(choice)) {
                    choice = {
                        label: choice,
                        value: choice
                    };
                }
                else {
                    if (!('label' in choice)) {
                        choice.label = choice.name;
                    }
                }
                choice.value = choice.name;
                return $.extend({
                    selected: (choice.value === value)
                }, choice);
            })
        };
        this.$el.html(this.template(context));
    }
});
promptTypes.inputType = promptTypes.text = promptTypes.base.extend({
    type: "text",
    datatype: "text",
    template: Handlebars.templates.inputType,
    templatePath: "templates/inputType.handlebars",
    events: {
        "change input": "modification",
        "swipeLeft input": "disableSwipingOnInput",
        "swipeRight input": "disableSwipingOnInput"
    },
    disableSwipingOnInput: function(evt){
        evt.stopPropagation();
    },
    modification: function(evt) {
        var that = this;
        var renderContext = this.renderContext;
        var value = this.$('input').val();
        this.setValue(value, function() {
            renderContext.value = value;

            that.validate(false, {
                success: function() {
                    renderContext.invalid = !that.validateValue(value);
                    that.render();
                },
                failure: function() {
                    renderContext.invalid = true;
                    that.render();
                }
            });
        });
    },
    onActivate: function(readyToRenderCallback) {
        var renderContext = this.renderContext;
        var value = this.getValue();
        renderContext.value = value;
        readyToRenderCallback();
    },
    beforeMove: function(continuation) {
        var that = this;
        that.setValue(this.$('input').val(), function() {
            continuation();
        });
    },
    validateValue: function(value) {
        return true;
    }
});
promptTypes.integer = promptTypes.inputType.extend({
    type: "integer",
    datatype: "integer",
    invalidMessage: "Integer value expected",
    validateValue: function(value) {
        return !isNaN(parseInt(value));
    }
});
promptTypes.number = promptTypes.inputType.extend({
    type: "number",
    datatype: "number",
    invalidMessage: "Numeric value expected",
    validateValue: function(value) {
        return !isNaN(parseFloat(value));
    }
});
/**
 * Media is an abstract object used as a base for image/audio/video
 */
promptTypes.media = promptTypes.base.extend({
    type: "media",
    events: {
        "click .whiteButton": "capture"
    },
    getCallback: function(bypath, byaction) {
        var that = this;
        return function(path, action, jsonString) {
            var jsonObject = JSON.parse(jsonString);
            if (jsonObject.status == -1 /* Activity.RESULT_OK */ ) {
                console.log("OK status returned");
                var mediaPath = (jsonObject.result !== null) ? jsonObject.result.mediaPath : null;
                if (mediaPath !== null) {
                    database.getData(that.name, function(value) {
                        console.log("found this path: " + value);
                        if (mediaPath != value) {
                            database.putData(that.name, "file", mediaPath, function() {
                                // TODO: delete old??? Or leave until marked as finalized?
                                // TODO: I'm not sure how the resuming works, but we'll need to make sure
                                // onActivate get's called AFTER this happens.
                            });
                        }
                    });
                }
            }
            else {
                console.log("failure returned");
                alert(jsonObject.result);
            }
        };
    }
});
promptTypes.image = promptTypes.media.extend({
    type: "image",
    datatype: "image",
    label: 'Take your photo:',
    template: Handlebars.templates.image,
    templatePath: "templates/image.handlebars",
    onActivate: function(readyToRenderCallback) {
        var that = this;
        var value = that.getValue();
        that.renderContext.mediaPath = value;
        that.renderContext.uriValue = opendatakit.asUri(value, 'img');
        readyToRenderCallback();
    },
    capture: function() {

        if (collect.getPlatformInfo !== 'Android') {
            // TODO: is this the right sequence?
            var outcome = collect.doAction(this.name, 'takePicture', 'org.opendatakit.collect.android.activities.MediaCaptureImageActivity', null);
            console.log("button click outcome is " + outcome);
            if (outcome === null || outcome !== "OK") {
                alert("Should be OK got >" + outcome + "<");
            }
        }
        else {
            // TODO: enable file chooser???
            alert("Not running on Android -- disabled");
        }
    }
});
promptTypes.video = promptTypes.media.extend({
    type: "video",
    label: 'Take your video:',
    template: Handlebars.templates.video,
    templatePath: "templates/video.handlebars",
    onActivate: function(readyToRenderCallback) {
        var that = this;
        var value = that.getValue();
        if (value != null && value.length != 0) {
            that.renderContext.uriValue = opendatakit.asUri(value, 'video', 'src');
            that.renderContext.videoPoster = opendatakit.asUri(opendatakit.baseDir + "img/play.png", 'video', 'poster');
        }
        readyToRenderCallback();
    },
    capture: function() {
        if (collect.getPlatformInfo !== 'Android') {
            // TODO: is this the right sequence?
            var outcome = collect.doAction(this.name, 'takeVideo', 'org.opendatakit.collect.android.activities.MediaCaptureVideoActivity', null);
            console.log("button click outcome is " + outcome);
            if (outcome === null || outcome !== "OK") {
                alert("Should be OK got >" + outcome + "<");
            }
        }
        else {
            // TODO: enable file chooser???
            alert("Not running on Android -- disabled");
        }
    }
});
promptTypes.audio = promptTypes.base.extend({
    type: "audio",
    datatype: "audio",
    template: Handlebars.templates.audio,
    templatePath: "templates/audio.handlebars",
    label: 'Take your audio:',
    capture: function() {
        if (collect.getPlatformInfo !== 'Android') {
            // TODO: is this the right sequence?
            var outcome = collect.doAction(this.name, 'takeAudio', 'org.opendatakit.collect.android.activities.MediaCaptureAudioActivity', null);
            console.log("button click outcome is " + outcome);
            if (outcome === null || outcome !== "OK") {
                alert("Should be OK got >" + outcome + "<");
            }
        }
        else {
            // TODO: enable file chooser???
            alert("Not running on Android -- disabled");
        }
    }

});
promptTypes.screen = promptTypes.base.extend({
    type: "screen",
    prompts: [],
    initialize: function() {
        var prompts = this.prompts;
        this.prompts = builder.initializePrompts(prompts);
        this.initializeTemplate();
        this.initializeRenderContext();
        this.afterInitialize();
    },
    isInitializeComplete: function() {
        var i;
        for ( i = 0 ; i < this.prompts.length; ++i ) {
            var p = this.prompts[i];
            if ( !p.isInitializeComplete() ) return false;
        }
        return true;
    },
    onActivateHelper: function(idx, readyToRenderCallback) {
        var that = this;
        return function() {
            if ( that.prompts.length > idx ) {
                var prompt = that.prompts[idx];
                prompt.onActivate(that.onActivateHelper(idx+1,readyToRenderCallback));
            } else {
                readyToRenderCallback();
            }
        }
    },
    onActivate: function(readyToRenderCallback) {
        if ( this.prompts.length == 0 ) {
            readyToRenderCallback();
        } else {
            var prompt = this.prompts[0];
            prompt.onActivate(this.onActivateHelper(1, readyToRenderCallback));
        }
    },
    render: function(){
        this.$el.html('<div class="prompts"></div>');
        var $prompts = this.$('.prompts');
        $.each(this.prompts, function(idx, prompt){
            var $promptEl = $('<div>');
            $prompts.append($promptEl);
            prompt.setElement($promptEl.get(0));
            prompt.render();
        });
    }
});
promptTypes.calculate = promptTypes.base.extend({
    type: "calculate",
    hideInHierarchy: true,
    isInitializeComplete: function() {
        return true;
    },
    onActivate: function(readyToRenderCallback){
        controller.gotoNextScreen();
    },
    evaluate: function() {
        this.model.set('value', this.formula());
    }
});
promptTypes.label = promptTypes.base.extend({
    type: "label",
    isInitializeComplete: function() {
        return true;
    },
    onActivate: function(readyToRenderCallback){
        controller.gotoNextScreen();
    }
});
promptTypes.goto = promptTypes.base.extend({
    type: "goto",
    hideInHierarchy: true,
    isInitializeComplete: function() {
        return true;
    },
    onActivate: function(readyToRenderCallback) {
        controller.gotoLabel(this.param);
    }
});
promptTypes.goto_if = promptTypes.base.extend({
    type: "goto_if",
    hideInHierarchy: true,
    isInitializeComplete: function() {
        return true;
    },
    condition: function(){
        return false;
    },
    onActivate: function(readyToRenderCallback) {
        if(this.condition()){
            controller.gotoLabel(this.param);
        } else {
            controller.gotoNextScreen();
        }
    }
});
});