import React from 'react';


class ServiceConfig extends React.Component {
    render() {
        return (
            <div className="widget-wrapper">
                <div className="card">
                    <div className="card-block">
                        <p><strong>Define Server</strong></p>
                        <p>Define the specification of the GraphQL server (make sure to specify schema and resolvers before)</p>
                        <form action="/generateServer" method="post">
                            <div className="md-form">
                                <input name="appName" type="text" className="form-control"/>
                                <label htmlFor="appName">Application Name</label>
                            </div>
                            <div className="md-form">
                                <input name="port" type="text" className="form-control"/>
                                <label htmlFor="port">Port</label>
                            </div>
                            <div>
                                <button type="submit" className="btn btn-default">Generate Server</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default ServiceConfig;
