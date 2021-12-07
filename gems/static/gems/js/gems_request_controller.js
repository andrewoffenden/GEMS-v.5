/*
    *gems_request_controller.js


    * copyright 2020 Douglas Post and David A. Woffenden
    *
    * many of the lines of code were written by Douglas Post, from his Simple Social
    * software and used here.
    *
    * This program is free software; you can redistribute it and/or modify
    * it under the terms of the GNU General Public License as published by
    * the Free Software Foundation; either version 2 of the License, or
    * (at your option) any later version.
    * but WITHOUT ANY WARRANTY; without even the implied warranty of
    * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    * GNU General Public License for more details.
    *
    * You should have received a copy of the GNU General Public License
    * along with this program; if not, write to the Free Software
    * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
    * MA 02110-1301, USA.
    *
    *

    Each class object titled GemsReq... is a composition class instantiated when there is a request from the gems main page.
        1.GemsViewerInterface initiates request on user click.
            a. instantiates subclass of GemsRequest which composes the request process.
        2.GemsRequest subclass usually creates a prompt with it's initRequest method.
            a. In a typical case the button will call the instantiated sublass's submitRequest method with params.
            b. Usually the modal prompt class will be recorded in the modalDialog attribute of that subclass.
               These are found in gems_modal_view.js.
        3.GemsRequest.submitRequest initiates an XHR using gemsXHRController.js.
            a. formats object passed as serialized JSON.
            b. fielded by views.py in an identically named server side GemsReq class.
            c. on return passes control back to GemsRequest
                    1. passes information back as a java script object.
        4. GemsRequest subclass now instantiates a ModalReport class to construct the report.
            a. uses GemsRequest instance method finalizeRequest to compose the process.
            b. generally will create the modal specified in the subclass attribute modalReport.
               These are found in gems_report_view.js.  However each respective sublass will have
               closing actions such as setting the reclaim request flag for the gems_controller

    Therefore in order to add a new Gems functionality one has to create a GemsRequestSubclass which will compose
    that process, with accompanying identically named GemsRequest class in the views.py file
    for the server side.  Additional subclasses are required for prompts and reports in the files:
    gems_modal_view.js, and gems_report_view.js (as mentioned above) which are assigned to the respective GemsRequest subclass
    attributes for those modals/reports.

    Notes for improvement in future versions:
    1.  Utilize inheritance more effectively in like functionality.
    2.  Modals should use the display method for their template literal formation.
        Again, allowing inheritance to reduce code redundancy.
    3.  The code written in later requests is tighter. Make earlier requests more uniform to these standards.

*/
class GemsRequestController
{
    /*
        This class maintains a map of the names and instances of initiated requests.
        When instantiated in Gems it registers a timed event that cleans up any gemsrequests
        that have their reclaim_request flag set to true.
    */
    constructor(reclaim_requests=false)
    {
        this.reclaim_requests = reclaim_requests;
        this.requests = new Map();
        if  (this.reclaim_requests === true) {
            this.reclaimRequests();
        }
    }
    initGemsRequest(request_class,prompt_data)
    {
        let request_instance = new request_class(prompt_data);
        let request_name = request_instance.toString();

        this.requests.set(request_name,request_instance)

        this.requests.get(request_name).initRequest();
    }
    reclaimGemsRequests()
    {
        for (const [key,value] of this.requests) {
            if (value.reclaim_request === true || undefined) {
                this.requests.delete(key);
            }
        }
    }
    reclaimGemsRequest(request)
    {
        try {
            if (this.requests.has(request)) {
                this.requests.delete(request);
            }
            else {
                throw "Request doesn't exist";
            }
        }
        catch(err) {
            console.log("Can't remove request; "+err);
        }
    }
    reclaimRequests()
    {
        //if reclaim_requests flag is true reclaim requests every thirty minutes.
        let context = this.reclaimRequests.bind(this);
        this.reclaimGemsRequests();
        setTimeout(context,1000*60*60*30);
    }
    reclaimSSE(request)
    {
        //cleanup of sse's  must occur here as request classes may need cleanup on main page switch.
        try {
            if (this.requests.has(request)) {
                //close all server-sent events associated with the request.
                this.requests.get(request).gemsSSE.closeEvents();
            }
            else {
                throw "Request doesn't exist";
            }
        }
        catch(err) {
            console.log("Can't close Server-Sent Events; "+err);
        }
    }
}
class GemsRequest
{

    constructor()
    {
        this.prompt_data = {};
        this.request_data = {};
        this.response_data = {}
        this.finalize_request = true;
        this.reclaim_request = false;
        this.modalDialog = {};
        this.modalReport = {};
    }

    toString()
    {
        return this.constructor.name;
    }

    /*
    this method is inherited by all gems request instances, its parameter is an html collection of input elements
    each element in the array must have a checkValidity() method.  Retruns true if all elements are valid, otherwise false.
    */
    isValid(collection)
    {
        try {
            if (collection.toString() == "[object HTMLCollection]") {
                for (let e of collection) {
                    if (e.checkValidity() == false) {
                            return false;
                    } else {
                        continue;
                    }
                }return true;
            }
            else {
                 throw "Not an HTMLCollection";
            }
        }
        catch(err) {
            console.log("Check your input fields:"+err);
        }
    }

    initRequest()
    {
         /*
            initiates the gemsrequest by instantiating modal and setting the modal "ok" to submitRequest
            this method may be overruled in subcalsses below. with special parameters for certain types
            of gemsrequest.
        */
        this.modalDialog = new this.modalDialog();
        this.modalDialog.display();
    }

    submitRequest()
    {
         /*
            composes the XHR process  and sets the callback as finalizeRequest
            parameters are instance attributes of subclass of GemsRequest
        */
       const xhr = new GemsXHRController();
       xhr.gemsXHR(this.method, this.url, this.request_data, this.finalize_request,this.toString());
    }

    finalizeRequest()
    {
        /*
            The response has now been recieved and the xhr handler has been assigned
            to this method.  It will operate on the GemsRequest instance property
            this.response_data. May be overriden in subclasses for custom behavior.
        */
            // this.modalReport = new this.modalReport();
            // this.modalReport.display();
            this.reclaim_request = true;
    }
}
class GemsReqStudentSearch extends GemsRequest
{
    /*
        This is the top menubar student search.  It is particular so the implementation in
        this subclass is atypical. The properties below are particular to this request process.
    */

    constructor()
    {
        super();
        this.method = "GET";
        this.url = this.toString();
        this.request_data = {"search_str":$('#gems_search_user').val()};
        this.response_data = {};
        this.finalize_request = true;
        this.modalDialog =  {};
        this.modalReport = GemsPromptDisplayStudent;
    }
    initRequest()
    {
        //    for this method the parameters object is passed in as there is no initial modal.it simply passes to the submitRequest method for XHR.
        if(this.request_data["search_str"]=="") {
            return;
        } else {
        this.submitRequest();
        }
    }
    submitRequest()
    {
       if(document.getElementById("gems_report")==null) {
            const xhr = new GemsXHRController();
            xhr.gemsXHR(this.method, this.url, this.request_data, this.finalize_request,this.toString());
       } else {
            const xhr = new GemsXHRController();
            xhr.gemsXHR(this.method, this.url, this.request_data, this.finalize_request,this.toString());
       }
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
        this.modalReport = new this.modalReport(this.response_data);
        this.modalReport.display();
        $('#gems_search_user').val('');
    }
}
class GemsSearch extends GemsRequest
{
    constructor()
    {
        super();
        this.method = "GET";
        this.url = this.toString();
        this.response_data = {};
        this.finalize_request = true;
    }
    initRequest()
    {
        this.modalDialog = new this.modalDialog();
        this.modalDialog.display();
    }
    submitRequest()
    {
        let search_str = document.getElementById('gems_input_search_user').value;
        if (search_str != "") {
            Object.assign(this.request_data,{"search_str":search_str});
            const xhr = new GemsXHRController().gemsXHR(this.method,this.url,this.request_data,this.finalize_request,this.toString());
        }
    }
    finalizeRequest()
    {
        $("#gems_prompt_search_results").empty();
        let results = new this.modalReport(this.response_data).display();
    }
}
class GemsReqEditUserSearch extends GemsSearch
{
    constructor()
    {
        super();
        this.request_data = {};
        this.modalDialog = GemsPromptEditUserSearch;
        this.modalReport = GemsReportEditUserSearch;
    }
}
class GemsReqResetPasswordSearch extends GemsSearch
{
    constructor()
    {
        super();
        this.request_data = {};
        this.modalDialog = GemsPromptResetPasswordSearch;
        this.modalReport = GemsReportResetPasswordSearch;
    }
}
class GemsReqDelUserSearch extends GemsSearch
{
    constructor()
    {
        super();
        this.request_data = {};
        this.modalDialog = GemsPromptDelUserSearch;
        this.modalReport = GemsReportDelUserSearch;
    }
}
class GemsReqEditStudentSearch extends GemsSearch
{
    constructor() {
        super();
        this.request_data = {};
        this.modalDialog = GemsPromptEditStudentSearch;
        this.modalReport = GemsReportEditStudentSearch;
    }
}
class GemsReqDelStudentSearch extends GemsSearch
{
    constructor()
    {
        super();
        this.request_data = {};
        this.modalDialog = GemsPromptDelStudentSearch;
        this.modalReport = GemsReportDelStudentSearch;
    }
}
class GemsReqBookSearch extends GemsRequest
{
    constructor()
    {
        super();
        this.method = "GET";
        this.url = this.toString();
        this.request_data = {};
        this.response_data = {};
        this.modalReport = GemsReportBookSearch;
    }
    initRequest()
    {
        let entries = document.getElementsByClassName("gems_user_input");
        [...entries].map(entry=>{if (entry.value != "") {this.request_data[entry.dataset.key]=entry.value;entry.value=""}});
        
        this.submitRequest(); }
    submitRequest()
    {
        $("#gems_book_search_results").empty();
        const xhr = new GemsXHRController().gemsXHR(this.method,this.url,this.request_data,this.finalize_request,this.toString());
    }
    finalizeRequest()
    {
        this.modalReport = new this.modalReport(this.response_data);
        this.modalReport.display();

        this.reclaim_request = true;
    }
}
class GemsReqItemSearch extends GemsRequest
{
    constructor()
    {
        super();
        this.method = "GET";
        this.url = this.toString();
        this.request_data = {};
        this.response_data = {};
        this.modalReport = GemsReportItemSearch;
    }
    initRequest()
    {
        let entries = document.getElementsByClassName("gems_user_input");
        [...entries].map(entry=>{if (entry.value != "") {this.request_data[entry.dataset.key]=entry.value;entry.value=""}});

        this.submitRequest();
    }
    submitRequest()
    {
        $("#gems_item_search_results").empty();
        const xhr = new GemsXHRController().gemsXHR(this.method,this.url,this.request_data,this.finalize_request,this.toString());
    }
    finalizeRequest()
    {
        this.modalReport = new this.modalReport(this.response_data);
        this.modalReport.display();

        this.reclaim_request = true;
    }
}
class GemsSelect extends GemsRequest
{
    /*
        special form of gems request, designed to be extended by gems select modals.
        only works with select modals that have one input that will transition to a full
        modal for editing ( in most cases).
    */
    constructor()
    {
        super();
        this.method = "GET";
        this.url = "lib/gems_request_mgmt.php";
        this.subreq_url = /*override*/"";
        this.request_data = {"request_class":this.toString()};
        this.response_data = {};
        this.modalDialog = {/*override*/};
        this.modalReport = {/*override*/};
    }
    initRequest()
    {
        //populate select and draw modal
        fetch(this.subreq_url).then(resp=>resp.json())
                    .then(json=>{let prompt_data = this.prompt_data; return Object.assign(prompt_data,{"gems_select":json})})
                    .then(prompt_data=>{this.modalDialog = new this.modalDialog(prompt_data);this.modalDialog.display()})
    }
    submitRequest()
    {
        //submit user selection to the server, and get associated sec group flags.
        let entry = document.getElementsByClassName("gems_user_input")[0];
        this.request_data[entry.dataset.key] = entry.value;

        const xhr = new GemsXHRController().gemsXHR(this.method,this.url,this.request_data,this.finalize_request,this.toString());
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
        this.modalDialog.destroy();
        gems_controller.initGemsRequest(this.modalReport,this.response_data);
    }
}
class GemsReqDisplayStudent extends GemsRequest
{
    constructor(prompt_data)
    {
        super();
        //A special property used if the requesting class must pass information to the prompt.
        this.prompt_data = prompt_data;
        this.method = "POST";
        this.url = this.toString();
        this.request_data =  {};
        this.response_data = {};
        this.modalDialog = {};
        this.modalReport =  GemsReportDisplayStudent;
        //This is a special property to the student info page involving SSE functionality.
        this.gemsWW = {};

    }
    initRequest()
    {
        //   modal dialog already exists so click needs to submit request.
        $("#gems_main_div").empty();
        this.submitRequest();
    }
    submitRequest()
    {
        //prompt_data here is the passed in response from the previously displayed and submitted GemsRequest.
        this.request_data["IDOC"] = this.prompt_data;
        const xhr = new GemsXHRController().gemsXHR(this.method, this.url, this.request_data, this.finalize_request,this.toString());
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
        this.modalReport = new this.modalReport(this.response_data);
        this.modalReport.display();

        //initiate web worker controller to periodically update student info while open.
        this.gemsWW = new GemsWWController();
    }
}
class GemsReqAddEnrollmentRecord extends GemsRequest
{
    constructor(prompt_data)
        {
            super();
            this.method = "POST";
            this.url = this.toString();
            this.prompt_data = prompt_data;
            this.request_data = {};
            this.response_data = {};
            this.modalDialog = GemsPromptAddEnrollmentRecord;
            this.modalReport = GemsPromptInformation;
        }
        initRequest()
        {
            let subrequest_url = "GemsReqEnrollmentRecordSelect";
                fetch(subrequest_url).then(resp=>resp.json())
                .then(json=>{
                    this.prompt_data["select_boxes"] = json;
                    this.modalDialog = new this.modalDialog(this.prompt_data);
                    this.modalDialog.display()})
        }
        submitRequest()
        {
            let entries = document.getElementsByClassName("gems_user_input");
            let checkboxes = document.getElementsByClassName("gems_user_input_check");

            if (!this.isValid(entries)) {
                alert("Please ensure that the form is filled out completely, and that all fields are correct.");
            }
            else {
                this.request_data["day"] = {};
                [...entries].map(entry=>{this.request_data[entry.dataset.key] = entry.value;});
                [...checkboxes].map(entry=>{this.request_data["day"][entry.dataset.key] = entry.dataset.status});

                const xhr = new GemsXHRController().gemsXHR(this.method,this.url,this.request_data,this.finalize_request,this.toString());
                this.modalDialog.destroy();
            }
        }
        finalizeRequest()
        {
            var message = "";

            //test return codes to generate prompt
            if (this.response_data["result"] == 0) {
                message = "Student was enrolled successfully.";
            }
            else if (this.response_data["result"] == 1){
                message = "No checkout records found";
            }
            else {
                message = "Error: Please contact an administrator.";
            }
            this.modalReport = new this.modalReport({"message":message});
            this.modalReport.display();

            this.reclaim_request = true;
        }
}
class GemsReqEditEnrollmentRecord extends GemsRequest
{
    constructor(event_data)
            {
                super();
                this.method = "POST";
                this.url = this.toString();
                this.event_data = event_data;
                this.prompt_data = {};
                this.request_data = {};
                this.response_data = {};
                this.modalDialog = GemsPromptEditEnrollmentRecord;
                this.modalReport = {};
            }
            initRequest()
            {
                let row = $(this.event_data.target).closest('.gems_result_row').contents();
                let entries = [...row].filter(val => val.className == 'gems_entry');

                [...entries].map(entry => this.prompt_data[entry.dataset.key] = entry.innerText);
                
                let subrequest_url = "GemsReqEnrollmentRecordSelect";
                    fetch(subrequest_url).then(resp=>resp.json())
                    .then(json=>{
                        this.prompt_data["select_boxes"] = json;
                        
                        this.modalDialog = new this.modalDialog(this.prompt_data);
                        this.modalDialog.display()})
            }
            submitRequest()
            {
                let entries = document.getElementsByClassName("gems_user_input");
                let checkboxes = document.getElementsByClassName("gems_user_input_check");

                if (!this.isValid(entries)) {
                    alert("Please ensure that the form is filled out completely, and that all fields are correct.");
                }
                else {
                    this.request_data["day"] = {};
                    [...entries].map(entry=>{this.request_data[entry.dataset.key] = entry.value;});
                    [...checkboxes].map(entry=>{this.request_data["day"][entry.dataset.key] = entry.dataset.status});
                    
                    const xhr = new GemsXHRController().gemsXHR(this.method,this.url,this.request_data,this.finalize_request,this.toString());
                    this.modalDialog.destroy();
                }
            }
            finalizeRequest()
            {
                this.reclaim_request = true;
            }
}
class GemsReqDelEnrollmentRecord extends GemsRequest
{
    constructor(event_data)
    {
        super();
        this.method = "POST";
        this.url = this.toString();
        this.event_data = event_data;
        this.prompt_data = {};
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = GemsPromptDelEnrollmentRecord;
        this.modalReport = {};
    }
    initRequest()
    {
        let row = $(this.event_data.target).closest('.gems_result_row').contents();
        let entries = [...row].filter(val => val.className == 'gems_entry');

        [...entries].map(entry => this.prompt_data[entry.dataset.key] = entry.innerText);

        this.modalDialog = new this.modalDialog(this.prompt_data);
        this.modalDialog.display();
    }
    submitRequest()
    {
        let entries = document.getElementsByClassName("gems_user_input");
        [...entries].map(entry=>{this.request_data[entry.dataset.key] = entry.value;});

        const xhr = new GemsXHRController().gemsXHR(this.method,this.url,this.request_data,this.finalize_request,this.toString());
        this.modalDialog.destroy();

    }
    finalizeRequest()
    {
        this.reclaim_request = true;
    }
}
class GemsReqAddTestRecord extends GemsRequest
{
    constructor(prompt_data)
        {
            super();
            this.method = "POST";
            this.url = this.toString();
            this.prompt_data = prompt_data;
            this.request_data = {};
            this.response_data = {};
            this.modalDialog = GemsPromptAddTestRecord;
            this.modalReport = {};
        }
        initRequest()
        {
            let subrequest_url = "GemsReqTestRecordSelect";
                fetch(subrequest_url).then(resp=>resp.json())
                .then(json=>{
                    this.prompt_data["select_boxes"] = json;
                    this.modalDialog = new this.modalDialog(this.prompt_data);
                    this.modalDialog.display()})
        }
        submitRequest()
        {
            let entries = document.getElementsByClassName("gems_user_input");
            //different logic for checkboxes, must iterate seperately and obtain their data-status attribute
            let check_entries = document.getElementsByClassName("gems_user_input_check");

            if (!this.isValid(entries)) {
                alert("Please ensure that the form is filled out completely, and that all fields are correct.");
            }
            else {
                [...entries].map(entry=>{this.request_data[entry.dataset.key] = entry.value;});
                [...check_entries].map(entry=>{this.request_data[entry.dataset.key] = entry.dataset.status;});

                const xhr = new GemsXHRController().gemsXHR(this.method,this.url,this.request_data,this.finalize_request,this.toString());
                this.modalDialog.destroy();
            }
        }
        finalizeRequest()
        {
            this.reclaim_request = true;
        }
}
class GemsReqEditTestRecord extends GemsRequest
{
    constructor(event_data)
    {
        super();
        this.method = "POST";
        this.url = this.toString();
        this.event_data = event_data;
        this.prompt_data = {};
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = GemsPromptEditTestRecord;
        this.modalReport = {};
    }
    initRequest()
    {
        let row = $(this.event_data.target).closest('.gems_result_row').contents();
        let entries = [...row].filter(val => val.className == 'gems_entry');

        [...entries].map(entry => this.prompt_data[entry.dataset.key] = entry.innerText);

        let subrequest_url = "GemsReqTestRecordSelect";
            fetch(subrequest_url).then(resp=>resp.json())
            .then(json=>{
                this.prompt_data["select_boxes"] = json;
                this.modalDialog = new this.modalDialog(this.prompt_data);
                this.modalDialog.display()
        })
    }
    submitRequest()
    {
        let entries = document.getElementsByClassName("gems_user_input");
        let check_entries = document.getElementsByClassName("gems_user_input_check");

        if (!this.isValid(entries)) {
            alert("Please ensure that the form is filled out completely, and that all fields are correct.");
        }
        else {
            [...entries].map(entry=>{this.request_data[entry.dataset.key] = entry.value;});
            [...check_entries].map(entry=>{this.request_data[entry.dataset.key] = entry.dataset.status;});

            const xhr = new GemsXHRController().gemsXHR(this.method,this.url,this.request_data,this.finalize_request,this.toString());
            this.modalDialog.destroy();
        }
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
    }

}
class GemsReqDelTestRecord extends GemsRequest
{
     constructor(event_data)
    {
        super();
        this.method = "POST";
        this.url = this.toString();
        this.event_data = event_data;
        this.prompt_data = {};
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = GemsPromptDelTestRecord;
        this.modalReport = {};
    }
    initRequest()
    {
        let row = $(this.event_data.target).closest('.gems_result_row').contents();
        let entries = [...row].filter(val => val.className == 'gems_entry');

        [...entries].map(entry => this.prompt_data[entry.dataset.key] = entry.innerText);

        this.modalDialog = new this.modalDialog(this.prompt_data);
        this.modalDialog.display();
    }
    submitRequest()
    {
        let entries = document.getElementsByClassName("gems_user_input");
        [...entries].map(entry=>{this.request_data[entry.dataset.key] = entry.value;});

        const xhr = new GemsXHRController().gemsXHR(this.method,this.url,this.request_data,this.finalize_request,this.toString());
        this.modalDialog.destroy();

    }
    finalizeRequest()
    {
        this.reclaim_request = true;
    }
}
class GemsReqAddStudentComment extends GemsRequest
{
    constructor(prompt_data)
    {
        super();
        this.method = "POST";
        this.url = this.toString();
        this.prompt_data = prompt_data;
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = GemsPromptAddStudentComment;
    }
    initRequest()
    {
        this.modalDialog = new this.modalDialog(this.prompt_data);
        this.modalDialog.display();
    }
    submitRequest()
    {
        let entries = document.getElementsByClassName("gems_user_input");
        [...entries].map(entry=>this.request_data[entry.dataset.key] = entry.value);

        const xhr = new GemsXHRController().gemsXHR(this.method,this.url,this.request_data,this.finalize_request,this.toString());
        this.modalDialog.destroy();
    }
    finalizeRequest()
    {
        this.reclaim_requst = true;
    }
}
class GemsReqDelStudentComment extends GemsRequest
{
    constructor(event_data)
    {
        super();
        this.method = "POST";
        this.url = this.toString();
        this.event_data = event_data;
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = GemsPromptDelStudentComment;
    }
    initRequest()
    {
        let row = $(this.event_data.target).closest('.gems_result_row').contents();
        let entries = [...row].filter(val => val.className === 'gems_entry');

        [...entries].map(entry => this.prompt_data[entry.dataset.key] = entry.innerText);
        
        this.modalDialog = new this.modalDialog(this.prompt_data);
        this.modalDialog.display();
    }
    submitRequest()
    {
        let entries = document.getElementsByClassName("gems_user_input");
        [...entries].map(entry=>this.request_data[entry.dataset.key] = entry.value);

        const xhr = new GemsXHRController().gemsXHR(this.method,this.url,this.request_data,this.finalize_request,this.toString());
        this.modalDialog.destroy();
    }
}
class GemsReqAddStudent extends GemsRequest
{
    constructor()
    {
        super();
        this.method = "POST";
        this.url = this.toString();
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = GemsPromptAddStudent;
        this.modalReport = GemsPromptInformation;
    }
     initRequest()
    {
        let subrequest_url = "GemsReqAddStudentSelect";
        fetch(subrequest_url).then(resp=>resp.json()).then(json=>{this.modalDialog = new this.modalDialog(json);this.modalDialog.display()})
    }
    submitRequest()
    {
        let entries = document.getElementsByClassName("gems_user_input");
        if (!this.isValid(entries)) {
            alert("Please ensure that the form is filled out completely, and that all fields are correct.");
        }
        else {
            [...entries].map(entry=>{this.request_data[entry.dataset.key] = entry.value;});
            const xhr = new GemsXHRController().gemsXHR(this.method,this.url,this.request_data,this.finalize_request,this.toString());
            this.modalDialog.destroy();
        }
    }
    finalizeRequest()
    {
        var message = "";

        if (this.response_data["result"] == 0) {
            message = "Student successfully added.";
        }
        else    {
            message = "Duplicate IDOC in the database.";
        }
        
        this.reclaim_request = true;

        this.modalReport= new this.modalReport({message});
        this.modalReport.display();
    }
}
class GemsReqEditStudent extends GemsRequest
{
  constructor(event_data) {
      super();
      this.method = "POST";
      this.url = this.toString();
      this.event_data = event_data;
      this.prompt_data = {};
      this.request_data = {};
      this.response_data = {};
      this.modalDialog = GemsPromptEditStudent;
      this.modalReport = GemsPromptInformation;
  }
  initRequest() {
      let row = $(this.event_data.target).closest(".gems_result_row").contents();
      [...row].map(e => {
          if (e.dataset) {
              this.prompt_data[e.dataset.key] = e.innerText
          }
      });

      let subrequest_url = "GemsReqAddStudentSelect";
      fetch(subrequest_url).then(resp => resp.json())
          .then(json => {
              let prompt_data = this.prompt_data;
              return Object.assign(prompt_data, {
                  "housing": json
              })
          })
          .then(prompt_data => {
              this.modalDialog = new this.modalDialog(prompt_data);
              this.modalDialog.display()
          })

      document.getElementById("gems_prompt").remove();
  }
  submitRequest() {
      let entries = document.getElementsByClassName("gems_user_input");
      if (!this.isValid(entries)) {
          alert("Please ensure that the form is filled out completely, and that all fields are correct.");
      } else {
          [...entries].map(entry => { this.request_data[entry.dataset.key] = entry.value;});
          const xhr = new GemsXHRController().gemsXHR(this.method, this.url, this.request_data, this.finalize_request, this.toString());
          this.modalDialog.destroy();
      }
  }
  finalizeRequest() {
      this.reclaim_request = true;
      this.modalReport = new this.modalReport({
          "message": "Successfully updated student!"
      }).display();
  }
}
class GemsReqDelStudent extends GemsRequest
{
    constructor(event_data)
    {
        super();
        this.method = "POST";
        this.url = this.toString();
        this.event_data = event_data;
        this.prompt_data = {};
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = GemsPromptDelStudent;
        this.modalReport = GemsPromptInformation;
    }
    initRequest()
    {
        let row = $(this.event_data.target).closest(".gems_result_row").contents();
        [...row].map(e=>{if(e.dataset){this.prompt_data[e.dataset.key]=e.innerText}});

        Object.assign(this.request_data, this.prompt_data);

        document.getElementById("gems_prompt").remove();
        this.modalDialog = new this.modalDialog(this.prompt_data);
        this.modalDialog.display();
    }
    submitRequest()
    {
        const xhr = new GemsXHRController().gemsXHR(this.method,this.url,this.request_data,this.finalize_request,this.toString());
        this.modalDialog.destroy();
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
        this.modalReport = new this.modalReport({"message":"Student entry successfully deleted!"}).display();
    }
}
class GemsReqEnterStudentBarcodes extends GemsRequest
{
    constructor()
    {
        super();
        this.prompt_data = {"barcodes": [] };
        this.modalDialog = GemsPromptEnterStudentBarcodes;
        this.modalReport = GemsReportEnterStudentBarcodes;
    }
    initRequest()
    {
        this.modalDialog = new this.modalDialog();
        this.modalDialog.display();
    }
    submitRequest()
    {
        $("#gems_prompt_barcode_preview").empty();

        let entry = document.getElementById("gems_user_input").value;
        $("#gems_user_input").val("").focus();
        
        entry = "*"+entry+"*";
        this.prompt_data["barcodes"].push(entry);

        let report = new this.modalReport(this.prompt_data);
        report.display();
    }
    finalizeRequest()
    {
        this.reclaim_request = true;

        let context = JSON.stringify(this.prompt_data);
        window.open('GemsReqPrintStudentBarcodes/'+context);
    }
}
class GemsReqPrintStudentBarcodes extends GemsRequest
{
    constructor(context)
    {

    }
}
class GemsReqUserTimesheet extends GemsRequest
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data || null;
        this.method = "GET";
        this.url = this.toString();
        this.request_data = {"reqMonth":document.getElementById("gems_timesheet_select_month") ? document.getElementById("gems_timesheet_select_month").value : "0"};
        this.response_data = {};
        this.modalDialog =  {};
        this.modalReport = GemsReportUserTimesheet;
    }
    initRequest()
    {
        //click here submits request, no modal required.
        $("#gems_main_div").empty();
        this.submitRequest()
    }
    submitRequest()
    {
        const xhr = new GemsXHRController().gemsXHR(this.method, this.url, this.request_data, this.finalize_request, this.toString());
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
        this.modalReport = new this.modalReport(this.response_data,this.prompt_data);
        this.modalReport.display();
        document.getElementById("gems_timesheet_select_month").selectedIndex = this.modalReport.request_month;
    }
}
class GemsReqUserTimesheetAddEntry extends GemsRequest
{
    constructor()
    {
        super();
        this.method = "POST";
        this.url = this.toString();
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = {};
        this.modalReport = {};
    }
    initRequest()
    {
        //collect the times and date. Add to this.request_data.
        let times = document.getElementsByClassName("gems_timesheet_add_time");
        for (var time of times) {
            let time_field = time.id.slice(15);
            this.request_data[time_field] = time.value;
        }
        this.request_data["entryDate"] = document.getElementById("gems_timesheet_add_date").value;
        this.submitRequest();
    }
    submitRequest()
    {
        const xhr = new GemsXHRController().gemsXHR(this.method, this.url, this.request_data, this.finalize_request, this.toString());
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
        gems_controller.initGemsRequest(GemsReqUserTimesheet,this.request_data);
    }
}
class GemsReqUserTimesheetEditEntry extends GemsRequest
{
    constructor(event_data)
    {
        super();
        this.method = "POST";
        this.url = this.toString();
        this.event_data = event_data;                                                                   //the click event, stored to locate the corrosponding row
        this.prompt_data = {};                                                                          //intended for data to be sent to modalDialog
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = GemsPromptEditTimesheet;
        this.modalReport = {};
    }
    initRequest()
    {
        //takes the closest row to the click event and selects the timesheet entries.
        let row = $(this.event_data.target).closest('.gems_timesheet_row').contents();
        let timesheet_entries = [...row].filter(val=>val.className=="gems_timesheet_entry");

        //collect time sheet entries from row, and place in this.request_data with key_names.
        [...timesheet_entries].map(entry=>this.prompt_data[entry.dataset.key]=entry.innerText);

        //set request_data for future use.
        this.request_data["IDOC"] = this.prompt_data["IDOC"];
        this.request_data["entryDate"] = this.prompt_data["entryDate"];

        this.modalDialog = new  this.modalDialog(this.prompt_data);
        this.modalDialog.display()
    }
    submitRequest()
    {
        //collect the modalDialog new entries to add to this.request_data for submission to server.
        let times = document.getElementsByClassName("gems_timesheet_time");
        [...times].map(entry=>{this.request_data[entry.dataset.key]=entry.value;});

        const xhr = new GemsXHRController().gemsXHR(this.method, this.url, this.request_data, this.finalize_request, this.toString());

        this.modalDialog.destroy();
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
        if (this.response_data["results"]===1) {
            //update only that row on the timesheet.
            let row = $(this.event_data.target).closest('.gems_timesheet_row').contents();
            let current_entries = [...row].filter(val=>val.className=="gems_timesheet_entry");

            [...current_entries].map(entry=>entry.innerText = this.request_data[entry.dataset.key]);
        }
    }
}
class GemsReqUserTimesheetDelEntry extends GemsRequest
{
    constructor(event_data)
    {
        super();
        this.method = "POST";
        this.url = this.toString();
        this.event_data = event_data;
        this.prompt_data = {};
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = GemsPromptDelTimesheetEntry;
        this.modalReport = {};
    }
    initRequest()
    {
        //takes the closest row to the click event and selects the timesheet entries.
        let row = $(this.event_data.target).closest('.gems_timesheet_row').contents();
        let timesheet_entries = [...row].filter(val=>val.className=="gems_timesheet_entry");

        //collect time sheet entries from row, and place in this.request_data with key_names.
        [...timesheet_entries].map(entry=>{ if (entry.dataset.key == "IDOC" || entry.dataset.key == "entryDate") {this.prompt_data[entry.dataset.key]=entry.innerText;}});

        Object.assign(this.request_data, this.prompt_data);
        this.modalDialog = new this.modalDialog(this.prompt_data);
        this.modalDialog.display();
    }
    submitRequest()
    {
        const xhr = new GemsXHRController().gemsXHR(this.method, this.url, this.request_data, this.finalize_request, this.toString());
        this.modalDialog.destroy();
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
        let row = $(this.event_data.target).closest('.gems_timesheet_row');
        row.empty();
    }
}
class GemsReqDisplayUserTimesheet extends GemsRequest
{
    constructor(prompt_data)
    {
        super();
        this.method = "GET";
        this.url = this.toString();
        this.prompt_data = prompt_data;
        this.request_data = {};
        this.modalDialog = GemsPromptDisplayUserTimesheet;
    }
    initRequest()
    {
        this.modalDialog = new this.modalDialog(this.prompt_data);
        this.modalDialog.display();
    }
    submitRequest()
    {
        //collect contents of modal dialog and submit via get with context
        let entries = document.getElementsByClassName("gems_user_input");
        [...entries].map(entry=>{this.prompt_data[entry.dataset.key] = entry.value;});

        let context = JSON.stringify(this.prompt_data);
        this.modalDialog.destroy();
        
        window.open('GemsReqDisplayUserTimesheet/' + context);
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
    }
}
class GemsReqUserChangePassword extends GemsRequest
{
    constructor()
    {
        super();
        this.method = "POST";
        this.url = this.toString();
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = GemsPromptUserChangePassword;
        this.modalReport = GemsPromptInformation;
    }
    initRequest()
    {
        this.modalDialog = new this.modalDialog();
        this.modalDialog.display();
    }
    submitRequest()
    {
        //check here to see before submitting if two password fields are the same.
        let entries = document.getElementsByClassName("gems_user_input");
        if (!this.isValid(entries)) {
            alert("Please ensure that the form is filled out completely, and that all fields are correct.");
        }
        else {
            [...entries].map(entry => { this.request_data[entry.dataset.key] = entry.value; });
            if (this.request_data["password"] == this.request_data["confirm"]) {
                const xhr = new GemsXHRController().gemsXHR(this.method, this.url, this.request_data, this.finalize_request, this.toString());
                this.modalDialog.destroy();
            } else {
                alert("Please ensure that both passwords match exactly.");
            }
        }
    }
    finalizeRequest()
    {
        //clean up and display information modal.
        this.reclaim_request = true;
        this.modalReport = new this.modalReport({ "message": "Password updated successfully " }).display();
    }
}
class GemsReqUserChangeTheme extends GemsRequest
{
    constructor()
    {
        super();
        this.method = "POST";
        this.url = this.toString();
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = GemsPromptUserChangeTheme;
        this.modalReport = GemsPromptInformation;
    }
    initRequest()
    {
        let subrequest_url = "GemsReqThemeSelect";
        fetch(subrequest_url).then(resp => resp.json()).then(json => {
            this.modalDialog = new this.modalDialog(json);
            this.modalDialog.display()
        })
    }
    submitRequest()
    {
        let entries = document.getElementsByClassName("gems_user_input");
        [...entries].map(entry=>{this.request_data[entry.dataset.key] = entry.value;});
        const xhr = new GemsXHRController().gemsXHR(this.method,this.url,this.request_data, this.finalize_request, this.toString());
        this.modalDialog.destroy();
    }
    finalizeRequest()
    {
        window.location = ".";
        this.reclaim_request = true;
        //this.modalReport = new this.modalReport({ "message": "Theme changed successfully" }).display();
    }
}
class GemsReqUserChangeAvatar extends GemsRequest
{
    constructor()
    {
        super();
        this.method = "POST";
        this.url = this.toString();
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = GemsPromptUserChangeAvatar;
        this.modalReport = GemsPromptInformation;
    }
    initRequest()
    {
        let subrequest_url = "GemsReqAvatarSelect";
        fetch(subrequest_url).then(resp => resp.json()).then(json => {
            this.modalDialog = new this.modalDialog(json);
            this.modalDialog.display()
        })
    }
    submitRequest()
    {
        let entries = document.getElementsByClassName("gems_user_input");
        [...entries].map(entry=>{this.request_data[entry.dataset.key] = entry.value;});
        // if (this.request_data["avatar"] == "custom") {
        //     localStorage.setItem("avatar", this.request_data["custom_avatar"]);

        //     this.modalDialog.destroy();
        // }
        // else {
            const xhr = new GemsXHRController().gemsXHR(this.method,this.url,this.request_data, this.finalize_request, this.toString());
            this.modalDialog.destroy();
        // }
    }
    finalizeRequest()
    {
        window.location = ".";
        this.reclaim_request = true;
        //this.modalReport = new this.modalReport({ "message": "Theme changed successfully" }).display();
    }
}
class GemsReqAdminAddUser extends GemsRequest
{
    constructor()
    {
        super();
        this.method = "POST";
        this.url = this.toString();
        this.prompt_data = {};
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = GemsPromptAdminAddUser;
        this.modalReport = GemsPromptInformation;
    }
    initRequest()
    {
        let subrequest_url = "GemsReqJobTitleSelect";
        fetch(subrequest_url).then(resp=>resp.json()).then(json=>{this.modalDialog = new this.modalDialog(json);this.modalDialog.display()})
    }
    submitRequest()
    {
        let entries = document.getElementsByClassName("gems_add_user_input");
        if (!this.isValid(entries)) {
            alert("Please ensure that the form is filled out completely, and that all fields are correct.");
        }
        else {
            [...entries].map(entry=>{this.request_data[entry.dataset.key] = entry.value;});
            const xhr = new GemsXHRController().gemsXHR(this.method,this.url,this.request_data,this.finalize_request,this.toString());
            this.modalDialog.destroy();
        }
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
        this.modalReport= new this.modalReport({"message":"Successfully added a new User!"}).display();
    }
}
class GemsReqAdminEditUser extends GemsRequest
{
    constructor(event)
    {
        super();
        this.method = "POST";
        this.url = this.toString();
        this.event_data = event;
        this.prompt_data = {};
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = GemsPromptAdminEditUser;
        this.modalReport = GemsPromptInformation;
    }
    initRequest()
    {
        let row = $(this.event_data.target).closest(".gems_result_row").contents();
        [...row].map(e=>{if(e.dataset){this.prompt_data[e.dataset.key]=e.innerText}});

        let subrequest_url = "GemsReqJobTitleSelect";
        fetch(subrequest_url).then(resp=>resp.json())
                .then(json=>{let prompt_data = this.prompt_data;return Object.assign(prompt_data,{"job_select":json})})
                .then(prompt_data=>{this.modalDialog = new this.modalDialog(prompt_data);this.modalDialog.display()})

        document.getElementById("gems_prompt").remove();
    }
    submitRequest()
    {
        let entries = document.getElementsByClassName("gems_user_input");
        if (!this.isValid(entries)) {
            alert("Please ensure that the form is filled out completely, and that all fields are correct.");
        }
        else {
            [...entries].map(entry=>{this.request_data[entry.dataset.key] = entry.value;});
            const xhr = new GemsXHRController().gemsXHR(this.method,this.url,this.request_data,this.finalize_request,this.toString());
            this.modalDialog.destroy();
        }
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
        this.modalReport = new this.modalReport({"message":"Successfully updated user!"}).display();
    }
}
class GemsReqAdminDelUser extends GemsRequest
{
    constructor(event_data)
    {
        super();
        this.method = "POST";
        this.url = this.toString();
        this.event_data = event_data;
        this.prompt_data = {};
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = GemsPromptAdminDelUser;
        this.modalReport = GemsPromptInformation;
    }
    initRequest()
    {
        let row = $(this.event_data.target).closest(".gems_result_row").contents();
        [...row].map(e=>{if(e.dataset){this.prompt_data[e.dataset.key]=e.innerText}});

        Object.assign(this.request_data, this.prompt_data);

        document.getElementById("gems_prompt").remove();
        this.modalDialog = new this.modalDialog(this.prompt_data);
        this.modalDialog.display();
    }
    submitRequest()
    {
        const xhr = new GemsXHRController().gemsXHR(this.method,this.url,this.request_data,this.finalize_request,this.toString());
        this.modalDialog.destroy();
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
        this.modalReport = new this.modalReport({"message":"User entry successfully deleted!"}).display();
    }
}
class GemsReqAdminResetPassword extends GemsRequest
{
    constructor(event_data)
    {
        super();
        this.method = "POST";
        this.url = this.toString();
        this.event_data = event_data;
        this.prompt_data = {};
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = GemsPromptAdminResetPassword;
        this.modalReport = GemsPromptInformation;
    }
    initRequest()
    {
        //need the idoc number of the user for the update on the server side,
        let row = $(this.event_data.target).closest(".gems_result_row").contents();
        [...row].map(e=>{if(e.dataset){this.prompt_data[e.dataset.key]=e.innerText}});

        document.getElementById("gems_prompt").remove();
        this.modalDialog = new this.modalDialog(this.prompt_data);
        this.modalDialog.display();
    }
    submitRequest()
    {
        //check here to see before submitting if two password fields are the same.
        let entries = document.getElementsByClassName("gems_user_input");
        if (!this.isValid(entries)) {
            alert("Please ensure that the form is filled out completely, and that all fields are correct.");
        }
        else {
            [...entries].map(entry=>{this.request_data[entry.dataset.key] = entry.value;});
            if (this.request_data["password"] == this.request_data["confirm"]) {
                const xhr = new GemsXHRController().gemsXHR(this.method,this.url,this.request_data,this.finalize_request,this.toString());
                this.modalDialog.destroy();
            } else {
                alert("Please ensure that both passwords match exactly.");
            }
        }

    }
    finalizeRequest()
    {
        //clean up and display information modal.
        this.reclaim_request = true;
        this.modalReport = new this.modalReport({"message":"Password updated successfully "}).display();
    }
}
class GemsReqAdminTestManagement extends GemsRequest
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data || null;
        this.method = "POST";
        this.url = this.toString();
        this.request_data = {};
        this.response_data = {};
        this.modalDialog =  {};
        this.modalReport = GemsReportTestManagement;
    }
    initRequest()
    {
        $("#gems_main_div").empty();
        this.submitRequest()
    }
    submitRequest()
    {
        const xhr = new GemsXHRController().gemsXHR(this.method, this.url, this.request_data, this.finalize_request, this.toString());
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
        this.modalReport = new this.modalReport(this.response_data);
        this.modalReport.display();
    }
}
class GemsReqAdminAddTest extends GemsRequest
{
    constructor()
    {
        super();
        this.method = "POST";
        this.url = this.toString();
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = GemsPromptAdminAddTest;
        this.modalReport = {};
    }
    initRequest()
    {
        this.modalDialog = new this.modalDialog();
        this.modalDialog.display();
    }
    submitRequest()
    {
        let entries = document.getElementsByClassName("gems_user_input");
        [...entries].map(entry=>this.request_data[entry.dataset.key]=entry.value);
        if (!this.isValid(entries)) {
            alert("Please ensure that the form is filled out completely, and that all fields are correct.");
        }
        else {
            [...entries].map(entry=>{this.request_data[entry.dataset.key] = entry.value;});

            const xhr = new GemsXHRController().gemsXHR(this.method,this.url,this.request_data,this.finalize_request,this.toString());
            this.modalDialog.destroy();
        }
    }
    finalizeRequest()
    {
        this.reclaim_request=true;
        gems_controller.initGemsRequest(GemsReqAdminTestManagement);
    }
}
class GemsReqAdminEditTest extends GemsRequest
{
    constructor(event_data)
    {
        super();
        this.method = "POST";
        this.url = this.toString();
        this.event_data = event_data;
        this.prompt_data = {};
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = GemsPromptAdminEditTest;
        this.modalReport = {};
    }
    initRequest()
    {
        let row = $(this.event_data.target).closest('.gems_test_row').contents();
        let entries = [...row].filter(val=>val.className=='gems_test_entry');

        [...entries].map(entry=>this.prompt_data[entry.dataset.key]=entry.innerText);

        this.modalDialog = new this.modalDialog(this.prompt_data);
        this.modalDialog.display();

        //set select boxes to correct values, convert first letter to upper for JS
        document.getElementById("gems_test_active").value = this.prompt_data["active"][0].toUpperCase()+this.prompt_data["active"].slice(1);
        document.getElementById("gems_cert_avail").value = this.prompt_data["certificate"][0].toUpperCase() + this.prompt_data["certificate"].slice(1);
    }
    submitRequest()
    {
        let entries = document.getElementsByClassName("gems_user_input");
        [...entries].map(entry=>this.request_data[entry.dataset.key]=entry.value);
        if (!this.isValid(entries)) {
            alert("Please ensure that the form is filled out completely, and that all fields are correct.");
        }
        else {
            [...entries].map(entry=>{this.request_data[entry.dataset.key] = entry.value;});

            const xhr = new GemsXHRController().gemsXHR(this.method,this.url,this.request_data,this.finalize_request,this.toString());
            this.modalDialog.destroy();
        }
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
        gems_controller.initGemsRequest(GemsReqAdminTestManagement);
    }
}
class GemsReqAdminDelTest extends GemsRequest
{
    constructor(event_data)
    {
        super();
        this.method = "POST";
        this.url = this.toString();
        this.event_data = event_data;
        this.prompt_data = {};
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = GemsPromptAdminDelTest;
        this.modalReport = {};
    }
    initRequest()
    {
        let row = $(this.event_data.target).closest('.gems_test_row').contents();
        let entries = [...row].filter(val=>val.className=='gems_test_entry');

        [...entries].map(entry=>this.prompt_data[entry.dataset.key]=entry.innerText);

        this.modalDialog = new this.modalDialog(this.prompt_data);
        this.modalDialog.display();
    }
    submitRequest()
    {
        this.request_data["id"] = this.prompt_data["id"];

        const xhr = new GemsXHRController().gemsXHR(this.method,this.url,this.request_data,this.finalize_request,this.toString());
        this.modalDialog.destroy();
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
        gems_controller.initGemsRequest(GemsReqAdminTestManagement);
    }
}
class GemsReqAdminClassTSManagement extends GemsRequest
{
    constructor(prompt_data)
    {
        super();
        this.prompt_data = prompt_data || null;
        this.method = "POST";
        this.url = this.toString();
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = {};
        this.modalReport = GemsReportClassTSManagement;
    }
    initRequest()
    {
        $("#gems_main_div").empty();
        this.submitRequest();
    }
    submitRequest()
    {
        const xhr = new GemsXHRController().gemsXHR(this.method, this.url, this.request_data, this.finalize_request, this.toString());
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
        this.modalReport = new this.modalReport(this.response_data);
        this.modalReport.display();
    }
}
class GemsReqAddClassTimeslot extends GemsRequest
{
    constructor()
    {
        super();
        this.method = "POST";
        this.url = this.toString();
        this.prompt_data = {};
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = GemsPromptAddClassTimeslot;
        this.modalReport = {};
    }
    initRequest() {
       let subrequest_url = "GemsReqClassSelect";
       fetch(subrequest_url).then(resp => resp.json()).then(json => {
           this.modalDialog = new this.modalDialog(json);
           this.modalDialog.display()
       })
    }
    submitRequest() {
        let entries = document.getElementsByClassName("gems_user_input");
        [...entries].map(entry => this.request_data[entry.dataset.key] = entry.value);
        if (!this.isValid(entries)) {
            alert("Please ensure that the form is filled out completely, and that all fields are correct.");
        } else {
            [...entries].map(entry => {
                this.request_data[entry.dataset.key] = entry.value;
            });
            const xhr = new GemsXHRController().gemsXHR(this.method, this.url, this.request_data, this.finalize_request, this.toString());
            this.modalDialog.destroy();
        }
    }
    finalizeRequest() {
        this.reclaim_request = true;
        gems_controller.initGemsRequest(GemsReqAdminClassTSManagement);
    }
}
class GemsReqEditClassTimeslot extends GemsRequest
{
    constructor(event_data)
    {
        super();
        this.method = "POST";
        this.url = this.toString();
        this.event_data = event_data;
        this.prompt_data = {};
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = GemsPromptEditClassTimeslot;
        this.modalReport = {};
    }
    initRequest()
    {
        let row = $(this.event_data.target).closest('.gems_class_row').contents();
        let entries = [...row].filter(val => val.className == 'gems_class_entry');

        [...entries].map(entry => this.prompt_data[entry.dataset.key] = entry.innerText);

        this.modalDialog = new this.modalDialog(this.prompt_data);
        this.modalDialog.display();
    }
    submitRequest()
    {
        let entries = document.getElementsByClassName("gems_user_input");
        [...entries].map(entry => this.request_data[entry.dataset.key] = entry.value);
        if (!this.isValid(entries)) {
            alert("Please ensure that the form is filled out completely, and that all fields are correct.");
        }
        else {
            [...entries].map(entry => { this.request_data[entry.dataset.key] = entry.value; });

            const xhr = new GemsXHRController().gemsXHR(this.method, this.url, this.request_data, this.finalize_request, this.toString());
            this.modalDialog.destroy();
        }
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
        gems_controller.initGemsRequest(GemsReqAdminClassTSManagement);
    }
}
class GemsReqDelClassTimeslot extends GemsRequest
{

    constructor(event_data)
    {
            super();
            this.method = "POST";
            this.url = this.toString();
            this.event_data = event_data;
            this.prompt_data = {};
            this.request_data = {};
            this.response_data = {};
            this.modalDialog = GemsPromptDelClassTimeslot;
            this.modalReport = {};
        }
        initRequest()
        {
            let row = $(this.event_data.target).closest('.gems_class_row').contents();
            let entries = [...row].filter(val => val.className == 'gems_class_entry');

            [...entries].map(entry => this.prompt_data[entry.dataset.key] = entry.innerText);

            this.modalDialog = new this.modalDialog(this.prompt_data);
            this.modalDialog.display();
        }
        submitRequest()
        {
            let entries = document.getElementsByClassName("gems_user_input");
            [...entries].map(entry => this.request_data[entry.dataset.key] = entry.value);
            if (!this.isValid(entries)) {
                alert("Please ensure that the form is filled out completely, and that all fields are correct.");
            } else {
                [...entries].map(entry => {
                    this.request_data[entry.dataset.key] = entry.value;
                });

                const xhr = new GemsXHRController().gemsXHR(this.method, this.url, this.request_data, this.finalize_request, this.toString());
                this.modalDialog.destroy();
            }
        }
        finalizeRequest()
        {
            this.reclaim_request = true;
            gems_controller.initGemsRequest(GemsReqAdminClassTSManagement);
        }
}
//TODO:: most of these management reports are the same. refactor to a superclass
class GemsReqAdminClassManagement extends GemsRequest
{
    constructor(prompt_data) {
        super();
        this.prompt_data = prompt_data || null;
        this.method = "POST";
        this.url = this.toString();
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = {};
        this.modalReport = GemsReportClassManagement;
    }
    initRequest() {
        $("#gems_main_div").empty();
        this.submitRequest();
    }
    submitRequest() {
        const xhr = new GemsXHRController().gemsXHR(this.method, this.url, this.request_data, this.finalize_request, this.toString());
    }
    finalizeRequest() {
        this.reclaim_request = true;
        this.modalReport = new this.modalReport(this.response_data);
        this.modalReport.display();
    }
}
class GemsReqAdminAddClass extends GemsRequest
{
    constructor()
    {
        super();
        this.method = "POST";
        this.url = this.toString();
        this.prompt_data = {};
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = GemsPromptAdminAddClass;
        this.modalReport = {};
    }
    initRequest()
    {
        let subrequest_url = "GemsReqAddClassSelect";
        fetch(subrequest_url).then(resp => resp.json()).then(json => {
            this.modalDialog = new this.modalDialog(json);
            this.modalDialog.display()
        })
    }
    submitRequest()
    {
        let entries = document.getElementsByClassName("gems_user_input");
        [...entries].map(entry => this.request_data[entry.dataset.key] = entry.value);
        if (!this.isValid(entries)) {
            alert("Please ensure that the form is filled out completely, and that all fields are correct.");
        } else {
            [...entries].map(entry => {
                this.request_data[entry.dataset.key] = entry.value;
            });
            const xhr = new GemsXHRController().gemsXHR(this.method, this.url, this.request_data, this.finalize_request, this.toString());
            this.modalDialog.destroy();
        }
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
        gems_controller.initGemsRequest(GemsReqAdminClassManagement);
    }
}
class GemsReqAdminEditClass extends GemsRequest
{
    constructor(event_data)
    {
        super();
        this.method = "POST";
        this.url = this.toString();
        this.event_data = event_data;
        this.prompt_data = {};
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = GemsPromptAdminEditClass;
        this.modalReport = {};
    }
    initRequest()
    {
        let row = $(this.event_data.target).closest('.gems_result_row').contents();
        let entries = [...row].filter(val=>val.className=='gems_entry');

        [...entries].map(entry=>this.prompt_data[entry.dataset.key]=entry.innerText);

        let subrequest_url = "GemsReqAddClassSelect";
        fetch(subrequest_url).then(resp => resp.json()).then(json => {this.prompt_data["select_boxes"] = json;
            this.modalDialog = new this.modalDialog(this.prompt_data);
            this.modalDialog.display()
        });
    }
    submitRequest()
    {
        let entries = document.getElementsByClassName("gems_user_input");
        [...entries].map(entry => this.request_data[entry.dataset.key] = entry.value);
        if (!this.isValid(entries)) {
            alert("Please ensure that the form is filled out completely, and that all fields are correct.");
        } else {
            const xhr = new GemsXHRController().gemsXHR(this.method, this.url, this.request_data, this.finalize_request, this.toString());
            this.modalDialog.destroy();
        }
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
        gems_controller.initGemsRequest(GemsReqAdminClassManagement);
    }
}
class GemsReqAdminDelClass extends GemsRequest
{
    constructor(event_data)
    {
        super();
        this.method = "POST";
        this.url = this.toString();
        this.event_data = event_data;
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = GemsPromptAdminDelClass;
        this.modalReport = {};
    }
    initRequest()
    {
        let row = $(this.event_data.target).closest('.gems_class_row').contents();
        let entries = [...row].filter(val=>val.className=='gems_class_entry');

        [...entries].map(entry=>this.prompt_data[entry.dataset.key]=entry.innerText);

        this.modalDialog = new this.modalDialog(this.prompt_data);
        this.modalDialog.display();
    }
    submitRequest()
    {
        this.request_data["id"] = this.prompt_data["id"];

        const xhr = new GemsXHRController().gemsXHR(this.method,this.url,this.request_data,this.finalize_request,this.toString());
        this.modalDialog.destroy();
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
        gems_controller.initGemsRequest(GemsReqAdminClassManagement);
    }
}
class GemsReqAdminSubjectManagement extends GemsRequest
{
    constructor(prompt_data) {
        super();
        this.prompt_data = prompt_data || null;
        this.method = "POST";
        this.url = this.toString();
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = {};
        this.modalReport = GemsReportSubjectManagement;
    }
    initRequest() {
        $("#gems_main_div").empty();
        this.submitRequest();
    }
    submitRequest() {
        const xhr = new GemsXHRController().gemsXHR(this.method, this.url, this.request_data, this.finalize_request, this.toString());
    }
    finalizeRequest() {
        this.reclaim_request = true;
        this.modalReport = new this.modalReport(this.response_data);
        this.modalReport.display();
    }
}
class GemsReqAdminAddSubject extends GemsRequest
{
    constructor()
    {
        super();
        this.method = "POST";
        this.url = this.toString();
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = GemsPromptAdminAddSubject;
        this.modalReport = {};
    }
    initRequest()
    {
        this.modalDialog = new this.modalDialog();
        this.modalDialog.display();
    }
    submitRequest()
    {
        let entries = document.getElementsByClassName("gems_user_input");
        [...entries].map(entry => this.request_data[entry.dataset.key] = entry.value);
        
        if (!this.isValid(entries)) {
            alert("Please ensure that the form is filled out completely, and that all fields are correct.");
        } else {
            [...entries].map(entry => {
                this.request_data[entry.dataset.key] = entry.value;
            });
            const xhr = new GemsXHRController().gemsXHR(this.method, this.url, this.request_data, this.finalize_request, this.toString());
            this.modalDialog.destroy();
        }
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
        gems_controller.initGemsRequest(GemsReqAdminSubjectManagement);
    }
}
class GemsReqAdminDelSubject extends GemsRequest
{
    constructor(event_data)
    {
        super();
        this.method = "POST";
        this.url = this.toString();
        this.event_data = event_data;
        this.prompt_data = {};
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = GemsPromptAdminDelSubject;
        this.modalResponse = GemsPromptInformation;
    }
    initRequest()
    {
        let row = $(this.event_data.target).closest('.gems_result_row').contents();
        let entries = [...row].filter(val=>val.className=='gems_entry');

        [...entries].map(entry=>this.prompt_data[entry.dataset.key]=entry.innerText);

        this.modalDialog = new this.modalDialog(this.prompt_data);
        this.modalDialog.display();
    }
    submitRequest()
    {
        this.request_data["id"] = this.prompt_data["id"];

        const xhr = new GemsXHRController().gemsXHR(this.method,this.url,this.request_data,this.finalize_request,this.toString());
        this.modalDialog.destroy();
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
        gems_controller.initGemsRequest(GemsReqAdminSubjectManagement);
    }
}
class GemsReqWebAttendance extends GemsRequest
{
    constructor()
    {
        super();
        this.method = "GET";
        this.prompt_data = {};
        this.url = this.toString();
        this.modalDialog = GemsPromptWebAttendance;
    }
    initRequest()
    {
        //populate select box for classes and render modal
        let subrequest_url = "GemsReqClassroomSelect";
        fetch(subrequest_url).then(resp => resp.json()).then(json => {
            this.modalDialog = new this.modalDialog(json);
            this.modalDialog.display();
        })
    }
    submitRequest()
    {
       //collect class from select and  open new window using template
        let entries = document.getElementsByClassName("gems_user_input");
        [...entries].map(entry=>{this.prompt_data[entry.dataset.key] = entry.value;});

        let context = JSON.stringify(this.prompt_data);
        this.modalDialog.destroy();

        window.open('GemsWebAttendance/' + context);
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
    }
}
class GemsReqAddAttendanceRecord extends GemsRequest
{
    /*
        collect IDOC, and class_id from web_attendance
        and add and attendance record to GEMS.

        TODO:: this should be post method, but there is internal django stuff happening. research.
    */
    constructor()
    {
        super();
        this.method = "GET";
        this.url = this.toString();
        this.date = new Date();
        this.request_data = {};
        this.response_data = {};
    }
    initRequest()
    {
        let entries = document.getElementsByClassName("gems_user_input");

        [...entries].map(entry => this.request_data[entry.dataset.key] = entry.value);
        this.request_data["hour"] = this.date.getHours();
        this.request_data["scan_time"] = this.date.toTimeString().slice(0,8);

        this.submitRequest();
    }
    submitRequest()
    {
        //submit request
        const xhr = new GemsXHRController().gemsXHR(this.method, this.url, this.request_data, this.finalize_request, this.toString());

        //clear IDOC input
        let e = document.getElementById("gems_web_attend_IDOC");
        e.value = "";
        e.focus();
    }
    finalizeRequest()
    {
        /*
            attendance record status will determine final response.
                1. If there is no class timeslot the message should display a message to web attendance.
                    a.  status codes:
                        0=success
                        1=no class_timeslot for given hour
                        2=no enrollment record for student at class timeslot.
                2. If there is no enrollment record it should give a helpful message to the student.
                3. If attendance record is created the web worker will update table periodically.
        */
       var target = $("#gems_web_attend_message");
       target.empty();

        if (this.response_data[0]["result"] === 1) {

            //if there is no class timeslot, display bulletin
            let message = $("<p style='color:red'> There are no scheduled classes in this room at this time.</p>");
            message.addClass("w3-panel w3-xlarge");

            target.empty();
            target.append(message);
        }
        else if (this.response_data[0]["result"] === 2) {
            //if there is no enrollment display message
            let message = $("<p style='color:red'> Unscheduled attendance record added.</p>");
            message.addClass("w3-panel w3-xlarge");

            target.empty();
            target.append(message);
        }
        else if (this.response_data[0]["result"] === 3) {
            //if there is no enrollment display message
            let message = $("<p style='color:red'>No unscheduled attendance permitted in this hour.  Contact an instructor.</p>");
            message.addClass("w3-panel w3-xlarge");

            target.empty();
            target.append(message);
        }
        else if (this.response_data[0]["result"] === 4) {
            //if there is no enrollment display message
            let message = $("<p style='color:red'> Student not found in the database.  Contact an instructor.</p>");
            message.addClass("w3-panel w3-xlarge");

            target.empty();
            target.append(message);
        }
        this.reclaim_request = true;
    }
}
class GemsReqManualAttendance extends GemsRequest
{
    constructor()
    {
        super();
        this.method = "POST";
        this.url = this.toString();
        this.request_data = {};
        this.response_data = {};
        this.date = new Date();
        this.modalDialog = GemsPromptManualAttendance;
        this.modalReport = GemsPromptInformation;
    }
    initRequest()
    {
        let subrequest_url = "GemsReqManualAttendanceSelect";
        fetch(subrequest_url).then(resp => resp.json()).then(json => {
            this.modalDialog = new this.modalDialog(json);
            this.modalDialog.display()
        })
    }
    submitRequest()
    {
        let entries = document.getElementsByClassName("gems_user_input");
        [...entries].map(entry => this.request_data[entry.dataset.key] = entry.value);
        if (!this.isValid(entries)) {
            alert("Please ensure that the form is filled out completely, and that all fields are correct.");
        } else {
            [...entries].map(entry => {
                this.request_data[entry.dataset.key] = entry.value;
            });
            this.request_data["scan_time"] = this.date.toTimeString().slice(0, 8);

            const xhr = new GemsXHRController().gemsXHR(this.method, this.url, this.request_data, this.finalize_request, this.toString());
            this.modalDialog.destroy();
        }
    }
    finalizeRequest()
    {
        if (this.response_data[0]["result"] == 0) {
             this.modalReport = new this.modalReport({
                 "message": " Attendance record added successfully."
             });
             this.modalReport.display();
        }
        else if (this.response_data[0]["result"] === 1) {
            //if there is no class timeslot, display bulletin
            this.modalReport = new this.modalReport({
                "message": " There are no scheduled classes in this room at this time."
            });
            this.modalReport.display();
        }
        else if (this.response_data[0]["result"] === 2) {
            //if there is no enrollment display message
             this.modalReport = new this.modalReport({
                 "message": "The student is currently not scheduled for a class at the selected time."
             });
             this.modalReport.display();
        }
        this.reclaim_request = true;
    }
}
class GemsReqDisplayDailyAttendance extends GemsRequest
{
    constructor()
    {
        super();
        this.method = "GET";
        this.url = this.toString();
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = GemsPromptDisplayDailyAttendance;
        this.modalReport = GemsReportDisplayDailyAttendance;
    }
    initRequest()
    {
        //double use the modal from GemsReqManualAttendance as fields are the same.
        let subrequest_url = "GemsReqManualAttendanceSelect";
        fetch(subrequest_url).then(resp => resp.json()).then(json => {
            this.modalDialog = new this.modalDialog(json);
            this.modalDialog.display()
        })
    }
    submitRequest()
    {
        let entries = document.getElementsByClassName("gems_user_input");
        [...entries].map(entry => {this.request_data[entry.dataset.key] = entry.value;});

        if (!this.isValid(entries)) {
             alert("Please ensure that the form is filled out completely, and that all fields are correct.");
        } else {
            const xhr = new GemsXHRController().gemsXHR(this.method, this.url, this.request_data, this.finalize_request, this.toString());
            $("#gems_main_div").empty();
        }
    }
    finalizeRequest()
    {
        if (this.response_data[0] != undefined && this.response_data[0]["result"] == 1) {
            this.modalReport = new GemsPromptInformation({"message":"There are no attendance records to display for this class timeslot at this date."});
            this.modalReport.display();
        }
        else {
            this.modalReport = new this.modalReport(this.response_data);
            this.modalReport.display();
        }

        this.reclaim_request = true;
    }
}
class GemsReqDisplayIndividualAttendance extends GemsRequest
{
    constructor()
    {
        super();
        this.method = "GET";
        this.url = this.toString();
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = GemsPromptDisplayIndividualAttendance;
        this.modalReport = GemsReportDisplayIndividualAttendance;
    }
    initRequest()
    {
        //display modal dialog
        this.modalDialog = new this.modalDialog();
        this.modalDialog.display();
    }
    submitRequest()
    {
        let entries = document.getElementsByClassName("gems_user_input");
        [...entries].map(entry => this.request_data[entry.dataset.key] = entry.value);

        if (!this.isValid(entries)) {
            alert("Please ensure that the form is filled out completely, and that all fields are correct.");
        } else {
            [...entries].map(entry => {
                this.request_data[entry.dataset.key] = entry.value;
            });
        }
        const xhr = new GemsXHRController().gemsXHR(this.method, this.url, this.request_data, this.finalize_request, this.toString());
        $("#gems_main_div").empty();
    }
    finalizeRequest()
    {
        if (this.response_data[0] != undefined && this.response_data[0]["result"] == 1) {
            this.modalReport = new GemsPromptInformation({
                "message": "There are no attendance records to display for this student at this date."
            });
            this.modalReport.display();
        } else {
            this.modalReport = new this.modalReport(this.response_data);
            this.modalReport.display();
        }
        this.reclaim_request = true;
    }
}
class GemsReqDisplayReports extends GemsRequest
{
    constructor()
    {
        super();
        /*
            1.  construct a basic report page and display in main div.
            2.  build function that will conduct pagination for report sections.
            3.  construct sub pages.
            4.  begin to write each respective report.
        */
       this.modalReport = GemsReportDisplayReports;
    }
    initRequest()
    {
        $("#gems_main_div").empty();

        this.modalReport = new this.modalReport();
        this.modalReport.display();

        this.finalizeRequest();
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
    }
}
class GemsReqGenerateCalloutCSV extends GemsRequest
{
    constructor()
    {
        super();
        this.method = "GET";
        this.url = this.toString();
        this.finalize_request = false;
        this.prompt_data = {};
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = GemsPromptGenerateCalloutCSV;
        this.modalReport = {};
    }
    initRequest()
    {
        //populate select box for classes and render modal, re-use modal as it populates with classes and days.
        let subrequest_url = "GemsReqClassroomHourDaySelect";
        fetch(subrequest_url).then(resp => resp.json()).then(json => {
            this.modalDialog = new this.modalDialog(json);
            this.modalDialog.display();
        })
    }
    submitRequest()
    {
        //validate fields submit request
        let entries = document.getElementsByClassName("gems_user_input");
        [...entries].map(entry => this.request_data[entry.dataset.key] = entry.value);

        if (!this.isValid(entries)) {
            alert("Please ensure that the form is filled out completely, and that all fields are correct.");
        } else {
            [...entries].map(entry => {
                this.request_data[entry.dataset.key] = entry.value;
            });
            const xhr = new GemsXHRController().gemsXHR(this.method, this.url, this.request_data, this.finalize_request, this.toString());
            this.modalDialog.destroy();
        }
    }
    finalizeRequest()
    {
        //reclaim request generate csv?
        this.reclaim_request = true;
    }
}
class GemsReqGenerateClassRoster extends GemsRequest
{
    constructor()
    {
        super();
        this.method = "GET";
        this.url = this.toString();
        this.prompt_data = {};
        this.request_data = {};
        this.modalDialog = GemsPromptGenerateClassRoster;
    }
      initRequest()
    {
        //populate select box and display modal.
        let subrequest_url = "GemsReqClassroomSelect";
        fetch(subrequest_url).then(resp => resp.json())
                    .then(json=>{this.modalDialog = new this.modalDialog(json); this.modalDialog.display();
        })
    }
    submitRequest()
    {
        //collect contents of modal dialog and submit via get with context
        let entries = document.getElementsByClassName("gems_user_input");
        let check_entries = document.getElementsByClassName("gems_user_input_check");

        if(!this.isValid(entries)) {
            alert("Please ensure that the form is filled out completely, and that all fields are correct.");
        } else {
            [...entries].map(entry=>{this.prompt_data[entry.dataset.key] = entry.value;});
            [...check_entries].map(entry=>{this.prompt_data[entry.dataset.key] = entry.dataset.status;});

            let context = JSON.stringify(this.prompt_data);
            this.modalDialog.destroy();

            window.open(this.url+ '/' + context);
        }
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
    }
}
class GemsReqGenerateEnrolledStudents extends GemsRequest
{
     constructor()
    {
        super();
        this.method = "GET";
        this.url = this.toString();
        this.prompt_data = {};
        this.request_data = {};
        this.modalDialog = GemsPromptGenerateEnrolledStudents;
    }
      initRequest()
    {
        //populate select box and display modal.
        let subrequest_url = "GemsReqClassroomSelect";
        fetch(subrequest_url).then(resp => resp.json())
                    .then(json=>{this.modalDialog = new this.modalDialog(json); this.modalDialog.display();
        })
    }
    submitRequest()
    {
        //collect contents of modal dialog and submit via get with context
        let entries = document.getElementsByClassName("gems_user_input");
        let check_entries = document.getElementsByClassName("gems_user_input_check");

        if(!this.isValid(entries)) {
            alert("Please ensure that the form is filled out completely, and that all fields are correct.");
        } else {
            [...entries].map(entry=>{this.prompt_data[entry.dataset.key] = entry.value;});
            [...check_entries].map(entry=>{this.prompt_data[entry.dataset.key] = entry.dataset.status;});

            let context = JSON.stringify(this.prompt_data);
            this.modalDialog.destroy();

            window.open(this.url+ '/' + context);
        }
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
    }
}
class GemsReqGenerateDailyAttendance extends GemsRequest
{
     constructor()
    {
        super();
        this.method = "GET";
        this.url = this.toString();
        this.prompt_data = {};
        this.request_data = {};
        this.modalDialog = GemsPromptGenerateDailyAttendance;
    }
      initRequest()
    {
        //populate select box and display modal.
        let subrequest_url = "GemsReqClassroomSelect";
        fetch(subrequest_url).then(resp => resp.json())
                    .then(json=>{this.modalDialog = new this.modalDialog(json); this.modalDialog.display();
        })
    }
    submitRequest()
    {
        //collect contents of modal dialog and submit via get with context
        let entries = document.getElementsByClassName("gems_user_input");
        let check_entries = document.getElementsByClassName("gems_user_input_check");

        if(!this.isValid(entries)) {
            alert("Please ensure that the form is filled out completely, and that all fields are correct.");
        } else {
            [...entries].map(entry=>{this.prompt_data[entry.dataset.key] = entry.value;});
            [...check_entries].map(entry=>{this.prompt_data[entry.dataset.key] = entry.dataset.status;});

            let context = JSON.stringify(this.prompt_data);
            this.modalDialog.destroy();

            window.open(this.url+ '/' + context);
        }
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
    }
}
class GemsReqGenerateContactHours extends GemsRequest
{
    constructor()
    {
        super();
        this.method = "GET";
        this.url = this.toString();
        this.prompt_data = {};
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = GemsPromptGenerateContactHours;
    }
    initRequest()
    {
        let subrequest_url = "GemsReqClassroomHourDaySelect";
        fetch(subrequest_url).then(resp => resp.json())
                    .then(json=>{this.modalDialog = new this.modalDialog(json); this.modalDialog.display();
        })
    }
    submitRequest()
    {
        let entries = document.getElementsByClassName("gems_user_input");
        let multi_select_entries = document.getElementsByClassName("gems_select_multiple")[0].selectedOptions;

        if(!this.isValid(entries)) {
            alert("Please ensure that the form is filled out completely, and that all fields are correct.");
        } else {
            [...entries].map(entry=>{this.prompt_data[entry.dataset.key] = entry.value;});
            this.prompt_data["hour"] = [...multi_select_entries].map(entry=>entry = entry.value);

            let context = JSON.stringify(this.prompt_data);
            this.modalDialog.destroy();
            window.open(this.url+ '/' + context);
        }
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
    }
}
class GemsReqGenerateAttendanceScan extends GemsRequest
{
     constructor()
    {
        super();
        this.method = "GET";
        this.url = this.toString();
        this.prompt_data = {};
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = GemsPromptGenerateAttendanceScan;
    }
    initRequest()
    {
        let subrequest_url = "GemsReqClassroomSelect";
        fetch(subrequest_url).then(resp => resp.json())
                    .then(json=>{this.modalDialog = new this.modalDialog(json); this.modalDialog.display();
        })
    }
    submitRequest()
    {
        let entries = document.getElementsByClassName("gems_user_input");

        if(!this.isValid(entries)) {
            alert("Please ensure that the form is filled out completely, and that all fields are correct.");
        } else {
            [...entries].map(entry=>{this.prompt_data[entry.dataset.key] = entry.value;});

            let context = JSON.stringify(this.prompt_data);
            this.modalDialog.destroy();

            window.open(this.url+ '/' + context);
        }
    }
    finalizeRequest()
    {
        this.reclasim_request = true;
    }
}
class GemsReqGenerateAssetsOut extends GemsRequest
{
    constructor()
    {
        super();
        this.method = "GET";
        this.url = this.toString();
        this.prompt_data = {};
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = GemsPromptGenerateAssetsOut;
    }
    initRequest()
    {
        let subrequest_url = "GemsReqClassroomSelect";
        fetch(subrequest_url).then(resp => resp.json())
                    .then(json=>{this.modalDialog = new this.modalDialog(json); this.modalDialog.display();
        })
    }
    submitRequest()
    {
        let entries = document.getElementsByClassName("gems_user_input");

        if(!this.isValid(entries)) {
            alert("Please ensure that the form is filled out completely, and that all fields are correct.");
        } else {
            [...entries].map(entry=>{this.prompt_data[entry.dataset.key] = entry.value;});

            let context = JSON.stringify(this.prompt_data);
            this.modalDialog.destroy();

            window.open(this.url+ '/' + context);
        }
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
    }
}
class GemsReqGenerateAssetsIn extends GemsRequest
{
    constructor()
    {
        super();
        this.method = "GET";
        this.url = this.toString();
        this.prompt_data = {};
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = GemsPromptGenerateAssetsIn;
    }
    initRequest()
    {
        let subrequest_url = "GemsReqClassroomSelect";
        fetch(subrequest_url).then(resp => resp.json())
                    .then(json=>{this.modalDialog = new this.modalDialog(json); this.modalDialog.display();
        })
    }
    submitRequest()
    {
        let entries = document.getElementsByClassName("gems_user_input");

        if(!this.isValid(entries)) {
            alert("Please ensure that the form is filled out completely, and that all fields are correct.");
        } else {
            [...entries].map(entry=>{this.prompt_data[entry.dataset.key] = entry.value;});

            let context = JSON.stringify(this.prompt_data);
            this.modalDialog.destroy();

            window.open(this.url+ '/' + context);
        }
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
    }
}
class GemsReqGenerateClassroomInventory extends GemsRequest
{
        constructor()
        {
                super();
                this.method = "GET";
                this.url = this.toString();
                this.prompt_data = {};
                this.request_data = {};
                this.response_data = {};
                this.modalDialog = GemsPromptGenerateClassroomInventory;
        }
        initRequest()
        {
            let subrequest_url = "GemsReqClassroomSelect";
            fetch(subrequest_url).then(resp => resp.json())
                        .then(json=>{this.modalDialog = new this.modalDialog(json); this.modalDialog.display();
            })
        }
        submitRequest()
        {
            let entries = document.getElementsByClassName("gems_user_input");

            if(!this.isValid(entries)) {
                alert("Please ensure that the form is filled out completely, and that all fields are correct.");
            } else {
                [...entries].map(entry=>{this.prompt_data[entry.dataset.key] = entry.value;});

                let context = JSON.stringify(this.prompt_data);
                this.modalDialog.destroy();

                window.open(this.url+ '/' + context);
            }
        }
        finalizeRequest()
        {
            this.reclaim_request = true;
        }
}
class GemsReqGenerateTestHistory extends GemsRequest
{
    constructor()
    {
        super();
        this.method = "GET";
        this.url = this.toString();
        this.prompt_data = {};
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = GemsPromptGenerateTestHistory;
    }
    initRequest()
    {
        let subrequest_url = "GemsReqTestRecordSelect";
        fetch(subrequest_url).then(resp => resp.json())
                    .then(json=>{this.modalDialog = new this.modalDialog(json); this.modalDialog.display();
        })
    }
    submitRequest()
    {
        let entries = document.getElementsByClassName("gems_user_input");

        if(!this.isValid(entries)) {
            alert("Please ensure that the form is filled out completely, and that all fields are correct.");
        } else {
            [...entries].map(entry=>{this.prompt_data[entry.dataset.key] = entry.value;});

            let context = JSON.stringify(this.prompt_data);
            this.modalDialog.destroy();

            window.open(this.url+ '/' + context);
        }
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
    }
}
class GemsReqManageEducationalAssets extends GemsRequest
{
    constructor()
    {
        super();
        this.method = "GET";
        this.url = this.toString();
        this.prompt_data = {};
        this.request_data = {};
        this.response_data = {};
        this.modalReport = GemsReportManageEducationalAssets;
    }
    initRequest()
    {
       //display modal report for manage assets
        $("#gems_main_div").empty();
        this.submitRequest();
    }
    submitRequest()
    {   
        let subreq_url = "GemsReqClassroomSelect";
        fetch(subreq_url).then(resp => resp.json()).then(json => {this.prompt_data = json;
            this.modalReport = new this.modalReport(this.prompt_data);
            this.modalReport.display()
        });
        /*
        this.modalReport = new this.modalReport();
        this.modalReport.display();*/

        this.finalizeRequest();
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
    }
}
class GemsReqGenerateDetails extends GemsRequest
{
    constructor(event_data)
    {
        super();
        this.method = "GET";
        this.url = this.toString();
        this.event_data = event_data;
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = GemsPromptGenerateDetails;
    }
    initRequest()
    {

        let row = $(this.event_data.target).closest('.gems_result_row').contents();
        let entries = [...row].filter(val => val.className === 'gems_entry');

        [...entries].map(entry => this.request_data[entry.dataset.key] = entry.innerText);

        this.submitRequest();
    }
    submitRequest()
    {
        const xhr = new GemsXHRController().gemsXHR(this.method, this.url, this.request_data, this.finalize_request, this.toString());
    }
    finalizeRequest()
    {
        this.modalDialog = new this.modalDialog(this.response_data);
        this.modalDialog.display();

        this.reclaim_request = true;
    }
}
class GemsReqGenerateHistory extends GemsRequest
{
    constructor(event_data)
    {
        super();
        this.method = "GET";
        this.url = this.toString();
        this.event_data = event_data;
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = GemsPromptGenerateHistory;
    }
    initRequest()
    {
        let row = $(this.event_data.target).closest('.gems_result_row').contents();
        let entries = [...row].filter(val => val.className === 'gems_entry');

        [...entries].map(entry => this.request_data[entry.dataset.key] = entry.innerText);

        this.submitRequest();
    }
    submitRequest()
    {
        const xhr = new GemsXHRController().gemsXHR(this.method, this.url, this.request_data, this.finalize_request, this.toString());
    }
    finalizeRequest()
    {
        this.modalDialog = new this.modalDialog(this.response_data);
        this.modalDialog.display();

        this.reclaim_request = true;
    }
}
class GemsReqEditEducationalAsset extends GemsRequest
{
    constructor(event_data)
    {
        super();
        this.method = "POST";
        this.url = this.toString();
        this.event_data = event_data;
        this.subrequest_data = {};
        this.prompt_data = {};
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = this.event_data["category"] == "Book" ? GemsPromptEditBook : GemsPromptEditItem;
    }
    initRequest()
    {
        let row = $(this.event_data["event"].target).closest('.gems_result_row').contents();
        let entries = [...row].filter(val => val.className === 'gems_entry');

        [...entries].map(entry => this.subrequest_data[entry.dataset.key] = entry.innerText);

        let subrequest_url = this.url +'/'+ JSON.stringify(this.subrequest_data);
        fetch(subrequest_url).then(resp => resp.json()).then(json => {this.prompt_data = json;
            this.modalDialog = new this.modalDialog(this.prompt_data);
            this.modalDialog.display()
        });
    }
    submitRequest()
    {

        let entries = document.getElementsByClassName("gems_user_input");
        [...entries].map(entry => this.request_data[entry.dataset.key] = entry.value);

        
        if (!this.isValid(entries)) {
            alert("Please ensure that the form is filled out completely, and that all fields are correct.");
        } else {
            const xhr = new GemsXHRController().gemsXHR(this.method, this.url, this.request_data, this.finalize_request, this.toString());
            this.modalDialog.destroy();
        }
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
    }
}
class GemsReqDeleteEducationalAsset extends GemsRequest
{
    constructor(event_data)
    {
        super();
        this.method = "POST";
        this.url = this.toString();
        this.event_data = event_data;
        this.prompt_data = {};
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = GemsPromptDeleteEducationalAsset;
    }
    initRequest()
    {
        let row = $(this.event_data.target).closest('.gems_result_row').contents();
        let entries = [...row].filter(val => val.className === 'gems_entry');

        [...entries].map(entry => this.prompt_data[entry.dataset.key] = entry.innerText);
        
        this.modalDialog = new this.modalDialog(this.prompt_data);
        this.modalDialog.display();
    }
    submitRequest()
    {
        let entries = document.getElementsByClassName("gems_user_input");

        [...entries].map(entry => this.request_data[entry.dataset.key] = entry.value);

        const xhr = new GemsXHRController().gemsXHR(this.method, this.url, this.request_data, this.finalize_request, this.toString());
        this.modalDialog.destroy();
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
    }
}
class GemsReqCheckinEducationalAsset extends GemsRequest
{
    constructor(event_data)
    {
        super();
        this.method = "POST";
        this.url = this.toString();
        this.event_data = event_data;
        this.prompt_data = {};
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = GemsPromptCheckinEducationalAsset;
    }
    initRequest()
    {
        let row = $(this.event_data.target).closest('.gems_result_row').contents();
        let entries = [...row].filter(val => val.className == 'gems_entry');

        [...entries].map(entry => this.prompt_data[entry.dataset.key] = entry.innerText);

        this.modalDialog = new this.modalDialog(this.prompt_data);
        this.modalDialog.display();
    }
    submitRequest()
    {
        this.request_data["id"] = this.prompt_data["id"];
        this.request_data["category"] = this.prompt_data["category"]

        const xhr = new GemsXHRController().gemsXHR(this.method, this.url, this.request_data, this.finalize_request, this.toString());
        this.modalDialog.destroy();
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
    }
}
class GemsReqCheckoutEducationalAsset extends GemsRequest
{
    constructor(prompt_data)
    {
        super();
        this.method = "POST";
        this.url = this.toString();
        this.prompt_data = prompt_data;
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = GemsPromptCheckoutEducationalAsset;
        this.modalReport = GemsPromptInformation;
    }
    initRequest()
    {
        this.modalDialog = new this.modalDialog(this.prompt_data);
        this.modalDialog.display();
    }
    submitRequest()
    {
        let entries = document.getElementsByClassName("gems_user_input");

        [...entries].map(entry => this.request_data[entry.dataset.key] = entry.value);

        if (!this.isValid(entries)) {
            alert("Please ensure that the form is filled out completely, and that all fields are correct.");
        } else {
            const xhr = new GemsXHRController().gemsXHR(this.method, this.url, this.request_data, this.finalize_request, this.toString());
            this.modalDialog.destroy();
        }
    }
    finalizeRequest()
    {
        var message = "";

        //test return codes to generate prompt
        if (this.response_data["result"] == 0) {
            message = "Asset checkout successfull.";
        }
        else if (this.response_data["result"] == 3){
            message = "Asset checkout not permitted.";
        }
        else if (this.response_data["result"] == 4) {
            message = "Asset not available.";
        }
        else {
            message = "Error: Please contact an administrator.";
        }

        this.modalReport = new this.modalReport({"message":message});
        this.modalReport.display();

        this.reclaim_request = true;
    }
}
class GemsReqRenewEducationalAsset extends GemsRequest
{
    constructor(event_data)
    {
        super();
        this.method = "POST";
        this.url = this.toString();
        this.event_data = event_data;
        this.prompt_data = {};
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = GemsPromptRenewEducationalAsset;
    }
    initRequest()
    {
        let row = $(this.event_data.target).closest('.gems_result_row').contents();
        let entries = [...row].filter(val => val.className == 'gems_entry');

        [...entries].map(entry => this.prompt_data[entry.dataset.key] = entry.innerText);

        this.modalDialog = new this.modalDialog(this.prompt_data);
        this.modalDialog.display();
    }
    submitRequest()
    {
        this.request_data["id"] = this.prompt_data["id"];
        this.request_data["category"] = this.prompt_data["category"]

        const xhr = new GemsXHRController().gemsXHR(this.method, this.url, this.request_data, this.finalize_request, this.toString());
        this.modalDialog.destroy();
    }
    finalizeRequest()
    {
        this.reclaim_request = true;
    }
}
class GemsReqAddEducationalAsset extends GemsRequest
{
    constructor(event_data)
    {
        super();
        this.method = "POST";
        this.url = this.toString();
        this.event_data = event_data;
        this.prompt_data = {};
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = this.event_data["category"] == "Book" ? GemsPromptAddBook : GemsPromptAddItem;
        this.modalReport = GemsPromptInformation;
    }
    initRequest()
    {
        //requires both a modal with select boxes, so subrequest
        let subrequest_url = this.url +'/'+ JSON.stringify(this.event_data);
        fetch(subrequest_url).then(resp => resp.json()).then(json => {this.prompt_data = json;
            this.modalDialog = new this.modalDialog(this.prompt_data);
            this.modalDialog.display()
        });
    }
    submitRequest()
    {
        //submits the request to add a record with fields
        let entries = document.getElementsByClassName("gems_user_input");

        [...entries].map(entry => this.request_data[entry.dataset.key] = entry.value);

        if (!this.isValid(entries)) {
            alert("Please ensure that the form is filled out completely, and that all fields are correct.");
        } else {
            const xhr = new GemsXHRController().gemsXHR(this.method, this.url, this.request_data, this.finalize_request, this.toString());
            this.modalDialog.destroy();
        }
    }
    finalizeRequest()
    {
        this.modalReport = new this.modalReport({"message":"Added Educational Asset with barcode: " + this.response_data["barcode"]});
        this.modalReport.display();
        
        this.reclaim_request = true;
    }
}
class GemsReqCopyEducationalAsset extends GemsRequest
{
    constructor(event_data)
    {
        super();
        this.method = "POST";
        this.url = this.toString();
        this.event_data = event_data;
        this.prompt_data = {};
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = GemsPromptCopyEducationalAsset;
        this.modalReport = GemsPromptInformation;
    }
    initRequest()
    {
        let row = $(this.event_data.target).closest('.gems_result_row').contents();
        let entries = [...row].filter(val => val.className === 'gems_entry');

        [...entries].map(entry => this.prompt_data[entry.dataset.key] = entry.innerText);

        this.modalDialog = new this.modalDialog(this.prompt_data);
        this.modalDialog.display();
    }
    submitRequest()
    {

        let entries = document.getElementsByClassName("gems_user_input");

        [...entries].map(entry => this.request_data[entry.dataset.key] = entry.value);

        if (!this.isValid(entries)) {
            alert("Please ensure that the form is filled out completely, and that all fields are correct.");
        } else {
            const xhr = new GemsXHRController().gemsXHR(this.method, this.url, this.request_data, this.finalize_request, this.toString());
            this.modalDialog.destroy();
        }
    }
    finalizeRequest()
    {
        this.modalReport = new this.modalReport({"message":"Added Educational Asset with barcode: " + this.response_data["barcode"]});
        this.modalReport.display();
        
        this.reclaim_request = true;
    }
}
class GemsReqQuickCheckin extends GemsRequest
{
    constructor()
    {
        super();
        this.method = "POST";
        this.url = this.toString();
        this.request_data = {};
        this.response_data = {};
        this.modalDialog = GemsPromptQuickCheckin;
        this.modalReport = GemsPromptInformation;
    }   
    initRequest()
    {
        this.modalDialog = new this.modalDialog();
        this.modalDialog.display();
    }
    submitRequest()
    {
        let entries = document.getElementsByClassName("gems_user_input");

        [...entries].map(entry => this.request_data[entry.dataset.key] = entry.value);

        if (!this.isValid(entries)) {
            alert("Please ensure that the form is filled out completely, and that all fields are correct.");
        } else {
            const xhr = new GemsXHRController().gemsXHR(this.method, this.url, this.request_data, this.finalize_request, this.toString());
            this.modalDialog.destroy();
        }
    }
    finalizeRequest()
    {
        var message = "";

        //test return codes to generate prompt
        if (this.response_data["result"] == 0) {
            message = "Asset checkin successfull.";
        }
        else if (this.response_data["result"] == 1){
            message = "No checkout records found";
        }
        else if (this.response_data["result"] == 3) {
            message = "Asset is currently checked-in.";
        }
        else {
            message = "Error: Please contact an administrator.";
        }
        this.modalReport = new this.modalReport({"message":message});
        this.modalReport.display();

        this.reclaim_request = true;
    }
}
class GemsReqEnterAssetBarcodes extends GemsRequest
{
    constructor()
    {
        super();
        this.prompt_data = {"barcodes": [] };
        this.modalDialog = GemsPromptEnterAssetBarcodes;
        this.modalReport = GemsReportEnterAssetBarcodes;
    }
    initRequest()
    {
        this.modalDialog = new this.modalDialog();
        this.modalDialog.display();
    }
    submitRequest(parameter)
    {
        $("#gems_prompt_barcode_preview").empty();
        
        //if individual barcode
        if (parameter["length"] == "range") {
            let start = document.getElementById("gems_start_range").value;
            let end = document.getElementById("gems_end_range").value;
            
            var i;
            var entry;
            
            for (i=start; i <= end; i++) {
                entry = "*"+i+"*";
                this.prompt_data["barcodes"].push(entry);
            }
            
        } else {
            let entry = document.getElementById("gems_user_input").value;
            $("#gems_user_input").val("").focus();

            entry = "*"+entry+"*";
            this.prompt_data["barcodes"].push(entry);
        }
        
        let report = new this.modalReport(this.prompt_data);
        report.display();
    }
    finalizeRequest()
    {
        this.reclaim_request = true;

        let context = JSON.stringify(this.prompt_data);
        window.open('GemsReqPrintStudentBarcodes/'+context);
    }
}
