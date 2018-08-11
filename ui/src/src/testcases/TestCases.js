import React, { Component } from 'react';
import SubComponent from '../common/SubComponent'
import { Link } from 'react-router-dom';
import TestCaseForm from '../testcases/TestCaseForm'
import TestCasesFilter from '../testcases/TestCasesFilter'
import axios from "axios";
import $ from 'jquery';

class TestCases extends SubComponent {
    state = {
        testcases: [],
        testcaseToEdit: {
            id: null,
            name: ""
        },
        projectAttributes: []
    };

    constructor(props) {
        super(props);
        this.onFilter = this.onFilter.bind(this);
    }

    componentDidMount() {
        super.componentDidMount();
        axios
          .get("/api/" + this.props.match.params.project + "/testcase")
          .then(response => {

            const testcases = response.data.map(testcase => {
              return {
                id: testcase.id,
                name: testcase.name,
                attributes: testcase.attributes
              };
            });

            const newState = Object.assign({}, this.state, {
              testcases: testcases
            });
            this.setState(newState);
          })
          .catch(error => console.log(error));

          axios
            .get("/api/" + this.props.match.params.project + "/attribute")
            .then(response => {
                 this.state.projectAttributes = response.data;
                 this.setState(this.state);
            })
            .catch(error => console.log(error));
     }

     editTestcase(testcaseId){
        this.state.testcaseToEdit = this.state.testcases.find(function(testcase){
            return testcaseId === testcase.id
        }) || {};
        this.setState(this.state);
        $("#editTestcase").modal('toggle');
     }


     onTestCaseAdded(testcase){
     }

     onFilter(filter){
        console.log(this.getFilterApiRequestParams(filter));
        axios
          .get("/api/" + this.props.match.params.project + "/testcase/tree?" + this.getFilterApiRequestParams(filter))
          .then(response => {

            const testcasesTree = response.data;
            const newState = Object.assign({}, this.state, {
              testcasesTree: testcasesTree
            });
            this.setState(newState);
          })
          .catch(error => console.log(error));
     }

     getFilterApiRequestParams(filter){
         var tokens = (filter.groups || []).map(function(group){return "groups=" + group});
         filter.filters.forEach(function(filter){
             filter.values.forEach(function(value){
                 tokens.push("attribute=" + filter.id + ":" + value);
             })
         })
         return tokens.join("&");
     }


    render() {
        var that = this;
        return (
            <div>
              <div>
                <TestCasesFilter projectAttributes={this.state.projectAttributes}
                        onFilter={this.onFilter} project={this.props.match.params.project}/>
              </div>
              <div>
                  <div>
                    <ul>{
                        this.state.testcases.map(function(testcase, i){
                            return <li>
                                <Link to={"/" + that.props.match.params.project + "/testcases/" + testcase.id}>{testcase.name}</Link>
                                <span onClick={(e) => that.editTestcase(testcase.id)}>Edit</span>
                            </li>
                        })
                    }</ul>
                  </div>
                  <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#editTestcase">
                    Add
                  </button>
                  <div className="modal fade" id="editTestcase" tabindex="-1" role="dialog" aria-labelledby="editTestcaseLabel" aria-hidden="true">
                      <TestCaseForm project={this.props.match.params.project}
                              testcase={this.state.testcaseToEdit}
                              projectAttributes={this.state.projectAttributes}
                              onTestCaseAdded={this.onTestCaseAdded}/>
                  </div>
              </div>
            </div>
        );
      }

}

export default TestCases;
