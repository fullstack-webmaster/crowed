import React from 'react';

const InsightCategory = props => {
  const goToDetail = (url) => {
    return props.history.push(`${props.location.pathname}/${url}`)
  }

  /**
   * Render
   */
  return (
    <div className="row">
      { props.data.map(({label, url, img}, index) => {
        return (
          <div className="col-sm-4" key={index}>
            <div className="menu-item" onClick={() => goToDetail(url)}>
              <img src={img ? require(`../../../assets/images/${img}`) : "http://placehold.it/400x400"} className="img-thumbnail" />
              <p>{ label }</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default InsightCategory
