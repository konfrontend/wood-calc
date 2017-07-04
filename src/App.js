import React, { Component } from 'react';
import {  Collapse,Checkbox } from 'react-bootstrap';

import './App.css';
import API from './API-data';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			materials: API.all(),
			area: 500,
			rate: API.get(0).rate,
			params: {
				length: 0,
				width: 0,
				depth: 0
			},
			amount: 1,
			cubic: 0,
			open:false
		};
		this.handleSelectMaterial = this.handleSelectMaterial.bind(this);
		this.handleChangeArea = this.handleChangeArea.bind(this);
		this.handleChangeDeck = this.handleChangeDeck.bind(this);
		this.handleChangeCubic = this.handleChangeCubic.bind(this);
		this.handleChangeAmount = this.handleChangeAmount.bind(this);
	}

	handleSelectMaterial(event) {
		this.setState({
			rate: event.target.value
		});
	}
	handleChangeArea(event) {
		var copy = Object.assign({}, this.state);

		copy.amount = (event.target.value / (
			(copy.params.width * copy.params.length)+
			(copy.params.length * copy.params.depth)+
			(copy.params.depth * copy.params.width))/2).toFixed(2);

		copy.cubic = (copy.amount * copy.params.length * copy.params.width * copy.params.depth ).toFixed(2);;
		copy.area = event.target.value;
		
		this.setState(copy);
	}
	handleChangeDeck(event) {
		var copy = Object.assign({}, this.state);

		if( event.target.dataset.type === 'length' ) {
			copy.params[event.target.dataset.type] = event.target.value;
		}
		else {
			copy.params[event.target.dataset.type] = event.target.value * 0.001;
		}
		copy.cubic = (copy.amount * copy.params.length * copy.params.width * copy.params.depth ).toFixed(2);
		copy.area =  (((copy.params.width * copy.params.length)+
			(copy.params.length * copy.params.depth)+
			(copy.params.depth * copy.params.width)) * 2 * copy.amount).toFixed(2);

		this.setState(copy);
	}
	handleChangeCubic(event) {
		var copy = Object.assign({}, this.state);

		var amount = (event.target.value /  copy.params.length /  copy.params.width /   copy.params.depth).toFixed(2);
		copy.cubic = event.target.value;
		copy.amount = amount;
		copy.area = (((copy.params.width * copy.params.length)+
			(copy.params.length * copy.params.depth)+
			(copy.params.depth * copy.params.width)) * 2 * copy.amount).toFixed(2);

		this.setState(copy);
	}
	handleChangeAmount(event) {
		var copy = Object.assign({}, this.state);
		copy.cubic = ( event.target.value * this.state.params.length * this.state.params.width * this.state.params.depth ).toFixed(2);
		copy.amount = event.target.value;
		copy.area = (((copy.params.width * copy.params.length)+
			(copy.params.length * copy.params.depth)+
			(copy.params.depth * copy.params.width)) * 2 * copy.amount).toFixed(2);
		this.setState(copy);
	}

	render() {
		return (
			<div className="jumbotron">
				<div className="row">
					<div className="col-sm-6">
						<Area action={this.handleChangeArea} area={this.state.area}/>
						<div className="">
							<Checkbox onChange={ ()=> this.setState({ open: !this.state.open })} checked={!this.state.open} className="">Я знаю площадь поверхности</Checkbox>
							<Collapse in={this.state.open}>
								<div className="row">
									<div className="col-md-12">
										<h4 className="text-muted">Параметры доски</h4>
									</div>
									<div className="col-md-7">
										<Deck action={this.handleChangeDeck} type="width" holder="Ширина мм" label="Ширина" unit="мм"/>
										<Deck action={this.handleChangeDeck} type="depth" holder="Толщина мм" label="Толщина" unit="мм"/>
										<Deck action={this.handleChangeDeck} type="length" holder="Длина м" label="Длина" unit="м"/>
									</div>
									<div className="col-md-5">
										<DeckAmount action={this.handleChangeAmount} value={this.state.amount} label="Кол-во"/>
										<CubicMeter action={this.handleChangeCubic} value={this.state.cubic}/>
									</div>
								</div>
							</Collapse>
						</div>
					</div>
					<div className="col-sm-6">
						<Materials action={this.handleSelectMaterial} materials={this.state.materials}/>
						<hr />
						<div className="thumbnail">
							<Consumption total={this.state.area * this.state.rate} />
						</div>
					</div>
				</div>
			</div>
		);
	}
}
const DeckAmount = (props) => (
	<div className="form-group">
		<div className="input-group ">
			<div className="input-group-addon">Кол-во</div>
			<input className="form-control" onChange={props.action} type="text" value={props.value}/>
			<div className="input-group-addon">шт</div>
		</div>
	</div>
)

const CubicMeter = (props) => (
	<div className="form-group">
		<div className="input-group">
			<div className="input-group-addon">Объем</div>
			<input className="form-control" type="text" onChange={props.action} value={props.value}/>
			<div className="input-group-addon">м<sup>3</sup></div>
		</div>
	</div>
)

const Deck = (props) => (
	<div className="form-group">
		<div className="input-group">
			<div className="input-group-addon">{props.label}</div>
			<input className="form-control" type="text" onChange={props.action} data-type={props.type} placeholder={props.holder} />
			<div className="input-group-addon">{props.unit}</div>
		</div>
	</div>
)

class Materials extends Component {
	render() {
		const materials = this.props.materials;
		const items = Object.keys(materials).map(function(key, index) {
			return (
				<option key={index}  className="form-control" value={materials[key].rate}>
					{materials[key].name}
				</option>
			)
		});

		return (
			<div className="form-group">
				<div className="input-group input-group-lg">
					<div className="input-group-addon">Материал</div>
					<select name="" id="" className="form-control"  defaultValue={ materials[0].rate } onChange={this.props.action}>
						{items}
					</select>
				</div>
			</div>
		)
	}
}

const Area = (props) => (
	<div className="form-group">
		<div className="input-group input-group-lg">
			<div className="input-group-addon">Поверхность</div>
			<input className="form-control" type="text" value={props.area} onChange={props.action}/>
			<div className="input-group-addon">м<sup>2</sup></div>
		</div>
	</div>

)
const Consumption = (props) => (
	<h1 className="consumtpion-title">{props.total.toFixed(2)} кг</h1>
)

export default App;
