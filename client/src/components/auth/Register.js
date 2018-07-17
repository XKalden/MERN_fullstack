import React, { Component } from 'react'

import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';


import { connect } from 'react-redux';
import { registerUser } from '../../actions/authActions';


import TextFieldGroup from '../common/TextFieldGroup';


class Register extends Component {
    constructor(){
        super();    
        this.state = {
            name: '',
            email: '',
            password: '',
            password2: '',
            errors: {}
        }
    }

    onChange = (e) => {
        // let e = e.target.value;
        this.setState({ [e.target.name] : e.target.value });
    }

    onSubmit = (e) => {
        e.preventDefault();
        const newUser = {
            name : this.state.name,
            email: this.state.email,
            password: this.state.password,
            password2: this.state.password2
        }
        console.log(newUser);

        // axios.post( '/api/users/register', newUser)
        //     .then(res => console.log(res.data))
        //     .catch(err => this.setState({errors: err.response.data}))

        // reducer 
        this.props.registerUser(newUser, this.props.history);
    }

    // componentWillReceiveProps(nextProps){
    //     if(nextProps.errors){
    //         this.setState({errors: nextProps.errors});

    //     }
    // }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.auth.isAuthenticated || this.props.auth.isAuthenticated){
            this.props.history.push('/dashboard');
        }

        if(prevState.errors !== this.props.errors){
            this.setState({errors: this.props.errors})
        }
    }

    componentDidMount(){
        if(this.props.auth.isAuthenticated){
            this.props.history.push('/dashboard');
        }
    }


    render() {
        const {errors} = this.state;

        // Redux state
        const  {user} = this.props.auth;
        return (
            // Regitser
            <div className="register">
                {user ? user.name : null}

                <div className="container">
                    <div className="row">
                    <div className="col-md-8 m-auto">
                        <h1 className="display-4 text-center">Sign Up</h1>
                        <p className="lead text-center">Create your DevConnector account</p>
                        {/* from page */}
                        <form noValidate action="create-profile.html" onSubmit={this.onSubmit}>

                            <TextFieldGroup
                            placeholder="Name"
                            name="name"
                            // type="text" Default text 
                            value={this.state.name}
                            onChange={this.onChange}
                            error={errors.name} />
               
                            <TextFieldGroup
                            placeholder="Email Address"
                            name="email"
                            type="email"
                            value={this.state.email}
                            onChange={this.onChange}
                            error={errors.email}
                            info="This site uses Gravatar so if you want a profile image, use a Gravatar email"
                            />

                            <TextFieldGroup
                                placeholder="Password"
                                name="password"
                                type="password"
                                value={this.state.password}
                                onChange={this.onChange}
                                error={errors.password}
                            />

                            <TextFieldGroup
                            placeholder="Confirm Password"
                            name="password2"
                            type="password"
                            value={this.state.password2}
                            onChange={this.onChange}
                            error={errors.password2}
                            />
                                    
                            <input type="submit" className="btn btn-info btn-block mt-4" />
                        </form>
                    </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors : state.errors
});

// React Data Type check
Register.propTypes = {
    registerUser : PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    error: PropTypes.object.isRequired
}


export default connect(mapStateToProps, {registerUser})(withRouter(Register));
