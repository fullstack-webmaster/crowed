import React from 'react';
import cx from 'classnames';
import data from './1010Data_data.json';

class Card extends React.Component {
  state = {
    type: 'departments',
    value: 'Engineering',
    hired: -1,
    options: data.departments
  }

  changeType(e) {
    this.setState({
      type: e.target.value,
      options: e.target.value === 'jobs' ? data.jobs : data.departments,
      value: e.target.value === 'jobs' ? data.jobs[0].id : data.departments[0],
    });
  }

  changeValue(e) {
    this.setState({
      value: e.target.value,
    });
  }

  getCardTitle() {
    if (!this.props.showDropDown) return;

    let title = null
    if (this.state.type === 'departments') {
      title = `Department: ${this.state.value}`
    } else {
      // jobs
      const activeJob = data.jobs.filter(job => job.id === this.state.value)[0];
      title = activeJob.name;
    }

    let legend = null;
    if (this.props.showHiredLegend && parseInt(this.state.hired) === 1) {
      legend = (
        <div style={{display: 'flex', alignItems: 'center'}}>
          <div style={{
            width: 40,
            height: 20,
            backgroundColor: 'red',
            marginRight: 5,
          }}></div>
          <div><b>Hired</b></div>
        </div>
      );
    }

    return (
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div>{title}</div>
        <div style={{marginLeft: 10}}>{legend}</div>
      </div>
    );
  }

  goBack(e) {
    e.preventDefault();
    this.props.history.goBack();
  }

  render() {
    const {title, children} = this.props;

    return (
      <div className="card">
        <div className="card-header text-center d-flex align-content-center">
          <span>
            <a style={{lineHeight: '35px'}} href="#" className="float-left" onClick={(e) => { this.goBack(e); }}>{'< Back'}</a>
          </span>
          <span style={{flex: 1, marginLeft: 25}} className="d-flex">
            <span style={{lineHeight: '35px'}} className="card-header-title">{ title }</span>
          </span>
          <span style={{width: '25%'}} className="d-flex align-content-center justify-content-end">
            {this.props.showDropDown &&
              <div className="d-flex flex-row justify-content-between">
                <select className="custom-select" value={this.state.filter} onChange={(e) => this.changeType(e) }>
                  <option value="departments">Departments</option>
                  <option value="jobs">Jobs</option>
                </select>

                <select style={{marginLeft: 10, width: 187}} className="custom-select" value={this.state.value} onChange={(e) => this.changeValue(e) }>
                  {this.state.options.map(opt =>
                    typeof opt === 'object' ?
                      <option key={opt.id} value={opt.id}>
                        {`${opt.name} - ${opt.id}`}
                      </option>
                      :
                      <option key={opt} value={opt}>{opt}</option>
                  )}
                </select>

                {this.props.showHiredDropDown &&
                  <select
                    style={{marginLeft: 10}}
                    className="custom-select"
                    value={this.state.hired}
                    onChange={e => this.setState({hired: e.target.value})}
                  >
                    <option value={-1}>All</option>
                    <option value={1}>Hired</option>
                    {/* <option value={0}>Not Hired</option> */}
                  </select>
                }
              </div>
            }
          </span>
        </div>
        <div className="card-block">
          {this.props.showDropDown &&
            <div>{this.getCardTitle()}</div>
          }

          {React.cloneElement(children, {
            filter: this.state.type,
            value: this.state.value,
            hired: this.state.hired,
          })}
        </div>
      </div>
    )
  }
}

export const CardItem = (props) => {
  const goToDetail = (url) => {
    if (!url) return;

    props.history.push(`${props.location.pathname}/${url}`);
  }

  return (
    <div className="row">
      { props.data.map((item, index) => {
        const image = item.img ? require(`../../assets/images/${item.img}`) : "http://placehold.it/400x400";

        return (
          <div className="col-md-4" onClick={() => goToDetail(item.url)} key={index}>
            <p style={{textAlign: 'center'}}>{ item.label }</p>
            <img src={image} className="img-thumbnail"/>
          </div>
        )
      })}
    </div>
  )
}

export default Card
