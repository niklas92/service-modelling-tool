import React from 'react';


class DataModel extends React.Component {
    render() {

        function addParameter() {
            console.log('Add a new parameter');
        }

        return (
            <div className="widget-wrapper">
                <h3>Data Model</h3><br/>
                <div className="card">
                    <div className="card-block">
                        <h4 className="card-title">Entity 1</h4>

                        <input id="entityName" name="entityName" type="text" className="form-control"/>
                        <label htmlFor="entityName">Entity name</label>

                        <br/>

                        <p><strong>Parameters</strong></p>
                        <div className="row">
                            <div className="col-lg-5">
                                <div className="md-form">
                                    <input name="parName" type="text" className="form-control"/>
                                    <label>Parameter name</label>
                                </div>
                            </div>
                            <div className="col-lg-5">
                                <div className="md-form">
                                    <input name="parType" type="text" className="form-control"/>
                                    <label>Parameter type</label>
                                </div>
                            </div>
                            <div className="col-lg-2 text-center">
                                <button onClick={addParameter} type="button" className="btn btn-sm float-right">Add</button>
                            </div>
                        </div>

                        <div>
                            <button className="btn btn-default float-right">OK</button>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default DataModel;
