import React from 'react';


class DataModel extends React.Component {
    render() {

        function addParameter() {
            console.log('Add a new parameter');
        }

        return (
            <div className="widget-wrapper">
                <h4>Data Model</h4><br/>
                <div className="card">
                    <div className="card-block">
                        <p><strong>New Entity</strong></p>
                        <p>Define a new entity</p>
                        <form className="md-form">
                            <input id="entityName" name="entityName" type="text" className="form-control"/>
                            <label htmlFor="entityName">Entity name</label>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="md-form">
                                        <input name="parName" type="text" className="form-control"/>
                                        <label>Parameter name</label>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="md-form">
                                        <input name="parType" type="text" className="form-control"/>
                                        <label>Parameter type</label>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <button onClick={addParameter} type="button" className="btn btn-default">Add Parameter</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default DataModel;
