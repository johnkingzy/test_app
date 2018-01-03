import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

class PdfPreviewer extends React.Component {
  state = {
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png",
    test: {}
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.test) {
      this.setState({
        test: nextProps.test
      })
    }
  }

  printDocument() {
    // var c = document.createElement('canvas');
    // var ctx = c.getContext('2d');
    // var img = document.getElementById('pdf-logo');
    // ctx.drawImage(img, 10, 10);
    // var base64String = c.toDataURL();
    // this.setState({
    //   logo: base64String
    // })
    const input = document.getElementById('pdf-content');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF("p", "mm", "a4");
        const width = pdf.internal.pageSize.width;    
        const height = pdf.internal.pageSize.height;
        pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
        pdf.save("download.pdf");
      })
    ;
  }

  averageScore(test) {
    console.log('test', test);
  }

  toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      var reader = new FileReader();
      reader.onloadend = function() {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }
  

  render() {
    const { formValue, test } = this.props;
    const totalQuestions = (questions => questions.filter(question => question.value).length);
    const averageScore = (questions) => {
      let sum = 0
      let answeredQuestions = questions.filter(question => question.value);
      answeredQuestions.forEach(question => sum += question.value);
      return Math.ceil(sum/answeredQuestions.length)

    }
    return (
      <div className="modal fade" id="pdfModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
              <button type="button" className="close btn btn-danger" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <div className="row">
                <div className="panel panel-default">
                  <div className="panel-heading clearfix">
                    <h4 className="pull-left">User Profile</h4>
                    <div className="btn-group pull-right">
                      <button onClick={this.printDocument.bind(this)} className="btn icon-btn btn-success">
                      <span className="glyphicon glyphicon-download"></span>  Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pdf-content" id="pdf-content"> 
                <div className="row">
                  <div className="col-md-3 col-xs-12 col-sm-6 col-lg-3">
                    <img alt="logo" src={this.state.logo} id="pdf-logo" className="img-responsive" />
                  </div>
                  <div className="col-md-9 col-xs-12 col-sm-6 col-lg-8" >
                    <div className="card pull-right">
                      <p><strong>Name of Clinic: </strong> ABC Specialist</p>
                      <p><strong>Tested By: </strong> Solomon Kingsley </p>
                      <p><strong>Street Address: </strong> 123 block street </p>
                      <p><strong>City: </strong> eadfsbfdhgsdzfd</p>
                      <p><strong>State: </strong> eadfsbfdhgsdzfd</p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 col-xs-12 col-sm-6 col-lg-12" >
                    <div className="card">
                      <p><strong><u>Patient Information</u></strong></p>
                      <p><strong>Full Name: </strong> {formValue.fullname}</p>
                      <p><strong>Gender: </strong> {formValue.gender}</p>
                      <p><strong>Age: </strong> {formValue.age}</p>
                      <p><strong>Race: </strong> {formValue.race}</p>
                      <p><strong>Tested on: </strong> {test.date}</p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="card">
                    {test.category !== 'PEQ TEST' ? <table className="table table-striped custab">
                      <thead>
                        <tr>
                          <th></th>
                          <th>Scale Name</th>
                          <th>Value</th>
                          <th className="text-center">Result</th>
                        </tr>
                      </thead>
                        <tr>
                          <td></td>
                          <td>Time</td>
                          <td>10</td>
                          <td className="text-center text-success">Test Passed</td>
                        </tr>
                      </table> : <table className="table table-striped custab">
                      <thead>
                        <tr>
                          <th></th>
                          <th>Group</th>
                          <th>No. of Questions</th>
                          <th className="text-center">Score</th>
                        </tr>
                      </thead>
                        {Object.keys(test.questions).map((category, i) => <tr key={i}>
                          <td></td>
                          <td>{category}</td>
                          <td>{totalQuestions(test.questions[category])}</td>
                          <td className="text-center text-success">{averageScore(test.questions[category])}</td>
                        </tr>)}
                      </table>}
                      <div className="card">
                        <u><strong>Comment</strong></u>
                        <p>{test.comment}</p>
                      </div>
                      </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default PdfPreviewer;
