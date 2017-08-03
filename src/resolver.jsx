import React from 'react';


class Resolver extends React.Component {
    render() {
        function addArgument() {
            console.log('Add a new argument');
        }

        function addHeaderParameter() {
            console.log('Add a new header parameter');
        }

        return (
            <div className="widget-wrapper">
                <h4>Resolver</h4><br/>
                <div className="row">

                    <div className="col-lg-6">
                        <div className="card">
                            <div className="card-block">
                                <p><strong>Resolver 1</strong></p>
                                <p>Define resolver 1</p>
                                <form className="md-form">
                                    <div className="md-form">
                                        <input type="text" className="form-control"/>
                                        <label>Resolver name</label>
                                    </div>
                                    <div className="md-form">
                                        <input type="text" className="form-control"/>
                                        <label>Return Type</label>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="md-form">
                                                <input type="text" className="form-control"/>
                                                <label>Argument name</label>
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="md-form">
                                                <input type="text" className="form-control"/>
                                                <label>Argument type</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <button onClick={addArgument} type="button" className="btn btn-default">Add Argument</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="card">
                            <div className="card-block">
                                <p><strong>API Request</strong></p>
                                <p>Define an API request</p>
                                <form>
                                    <div className="md-form">
                                        <input type="text" className="form-control"/>
                                        <label>URL</label>
                                    </div>
                                    <div className="md-form">
                                        <input type="text" className="form-control"/>
                                        <label>HTTP Method</label>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="md-form">
                                                <input name="parName" type="text" className="form-control"/>
                                                <label>Header Parameter name</label>
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="md-form">
                                                <input name="parType" type="text" className="form-control"/>
                                                <label>Header Parameter type</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <button onClick={addHeaderParameter} type="button" className="btn btn-sm">Add Header Parameter</button>
                                    </div>
                                    <div>
                                        <button type="button" className="btn btn-default">Add Authentication</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default Resolver;
