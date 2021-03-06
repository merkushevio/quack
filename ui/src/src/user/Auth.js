import React, { Component } from 'react';
import { withRouter } from 'react-router';
import axios from "axios";
import qs from 'qs';

class Auth extends Component {
    render() {
        return (
          <div>

          </div>
        );
      }

    componentDidMount() {
        var params = qs.parse(this.props.location.search.substring(1));
        axios
          .get("/api/user/login-redirect")
          .then(response => {
            var url = response.data.url || "/login";
            var retpath = params.retpath || "";
            var retpathParamName = response.data.retpathParamName || "retpath";
            if (retpath.startsWith(window.location.origin + "/auth") ||
                            retpath.startsWith(window.location.origin + "/login")){
                retpath = "/";
            }

            url = url +  "?" + retpathParamName + "=" + encodeURIComponent(retpath);
            window.location = url;
          })
          .catch(error => console.log(error));
    }

}

export default withRouter(Auth);
