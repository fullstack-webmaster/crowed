import React from 'react';

import Card from '../../components/Card';
import TreeMap from '../../components/Visualisation/TreeMap';
const pco_expTM = require('./1010Data_pco_expTM.json');

class PreviousCompany extends React.Component {
  state = {
    data: [
      {
        label: 'Companies by Years of Experience',
        url: 'years-of-experience-x-companies',
        img: 'submenu_prev_companies_by_exp.png'
      },
      // {
      //   label: 'Companies by Education Level',
      //   url: 'education-level-x-companies',
      //   img: 'submenu_prev_companies_by_ed.png'
      // }
    ],
  }
  render() {
    return (
      <div className="row">
        <div className="col-sm-10 offset-sm-1">
          <Card showDropDown showHiredDropDown title="Companies by Years of Experience" {...this.props}>
            <TreeMap data={pco_expTM}/>
          </Card>
        </div>
      </div>
    )
  }
}

export default PreviousCompany;
export {default as PreviousCompanyView} from './view';
