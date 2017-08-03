import React from 'react';


class ServiceConfig extends React.Component {
    render() {
        return (
            <div className="widget-wrapper">
                <h4>Service Model</h4><br/>
                <div className="card">
                    <div className="card-block">
                        <p><strong>Define Server</strong></p>
                        <p>Define the specification of the GraphQL server (make sure to specify schema and resolvers before)</p>
                        <form>
                            <div className="md-form">
                                <input name="appName" type="text" className="form-control"/>
                                <label htmlFor="appName">Application Name</label>
                            </div>
                            <div className="md-form">
                                <input name="port" type="text" className="form-control"/>
                                <label htmlFor="port">Port</label>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default ServiceConfig;
