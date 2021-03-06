import React, { Component } from 'react';
import Switch from 'react-switch';
import UploadImage from '../Images/UploadImage';
import { appendCertainProject } from '../../../ducks/actions/site';
import { connect } from 'react-redux';

const inputs =
[
    { label: 'Title', value: 'title' },
    { label: 'Image Url', value: 'image' },
    { label: 'Project Url', value: 'url' },
    { label: 'Project Source Url', value: 'source_url' }
];

const Input = ({ label, value, newProject, onChange }) => (
    <label className='col admin-edit-panel-selection-project-input-group'>
        <h1 className='admin-edit-panel-selection-project-label'>{ label }</h1>
        <input className='admin-edit-panel-selection-project-input' type='text' name={ value } value={ newProject[value] } onChange={ (e) => onChange(e) } />
    </label>
);

const mapStateToProps = ({ site }) => ({
    user: site.user,
    cognito: site.cognito
});

const mapDispatchToProps = (dispatch) => ({ addProject: (cognito, project) => dispatch(appendCertainProject(cognito, project)) });
export default connect(mapStateToProps, mapDispatchToProps)(class extends Component
{
    state = { newProject: {} };

    editNewProjectState(e)
    {
        const target = e.target;
        const value = target.value;
        const name = target.name;
        if (name === 'priority')
        {
            const newProject = Object.assign({}, this.state.newProject, { [name]: parseInt(value) });
            this.setState({ newProject });
            return;
        }
        const newProject = Object.assign({}, this.state.newProject, { [name]: value });
        this.setState({ newProject });
    }

    uploadProject()
    {
        const { newProject } = this.state;
        const { cognito } = this.props;
        this.props.addProject(cognito, newProject);
        this.setState({ newProject: {} }, () => this.props.setAsNewProject(false));
    }

    render()
    {
        const { resourceCategory, resource } = this.props;
        const { newProject } = this.state;
        return (
            <>
                <div className='row halign'>
                    <h1 className='admin-edit-panel-selection'>{ resourceCategory === 'images' ? resource.image_id : resource.title }</h1>
                    { (resourceCategory === 'images') && <UploadImage /> }
                    { (resourceCategory === 'projects' && Object.keys(newProject).length == 0) &&
                        <button className='admin-edit-panel-selection-new-button' onClick={ () => this.setState({ newProject: { finished: false } }, () => this.props.setAsNewProject(true)) }>New</button>}
                </div>
                { (resourceCategory === 'projects' && (Object.keys(newProject).length > 0)) && (
                    <>
                        <div className='row halign valign valign-children admin-edit-panel-selection-project-active-group'>
                            <h1 className='admin-edit-panel-selection-project-active'>Active</h1>
                            <Switch className='admin-edit-panel-selection-project-active-checkbox' checked={ newProject.finished ? newProject.finished : false }
                                onChange={ (finished) => this.setState({ newProject: Object.assign({}, newProject, { finished })  })  }
                                uncheckedIcon={ false } checkedIcon={ false } handleDiameter={ 30 } boxShadow='0px 1px 5px rgba(0, 0, 0, 0.6)' onHandleColor='#FFFFFF' onColor='#2CC841'
                            />
                        </div>
                        { inputs.map((props) => (
                            <Input key={ props.label } onChange={ (e) => this.editNewProjectState(e) } newProject={ newProject } { ...props } />
                        ))}
                        <label className='col admin-edit-panel-selection-project-input-group'>
                            <h1 className='admin-edit-panel-selection-project-label'>Description</h1>
                            <textarea rows={ 4 } className='admin-edit-panel-selection-project-textarea' name='description'
                                value={ newProject.description } onChange={ (e) => this.editNewProjectState(e) }
                            />
                            <h1 className='admin-edit-panel-selection-project-label'>Project Order Number</h1>
                            <input name='priority' value={ newProject.priority } onChange={ (e) => this.editNewProjectState(e) }></input>
                            <h1 className='admin-edit-panel-selection-project-label'>Project Tags (, separated)</h1>
                            <input name='tags' value={ newProject.tags } onChange={ (e) => this.editNewProjectState(e) }></input>
                        </label>
                        <div className='row admin-edit-panel-selection-project-button-group'>
                            <button className='admin-edit-panel-selection-new-button' onClick={ () => this.uploadProject() }>Create</button>
                            <button className='admin-edit-panel-selection-delete-button' onClick={ () => this.setState({ newProject: {} }, () => this.props.setAsNewProject(false)) }>Discard</button>
                        </div>
                    </> )}
            </>
        );
    }
});