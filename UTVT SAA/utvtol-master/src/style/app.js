export default {
  container: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f2f7',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  welcome: {
    fontSize: 18,
    marginBottom: 8,
  },
  targets: {
    padding: 30,
    backgroundColor: 'white',
  },
  footer: {
    flex: 2,
  },
  h1_screens: {
    fontSize: 20,
    textAlign: 'center',
  },
  containerDatable: {
    flex: 4,
    width: '100%',
    alignSelf: 'center',
    paddingTop: 20
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: 'green',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  contenidoModal: {
    paddingTop: 156,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerText: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  rowText: {
    flex: 1,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'green',
    padding: 5,
    borderRadius: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  },
  column: {
    flex: 3,
    flexDirection: 'column',
  },
  scrollView: {
    flex: 1,
  },
  col: {
    flex: 3,
    flexDirection: 'row-reverse',
    paddingTop: 10,
    padding: 30,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },

  button2: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  picker: {
    width: 200,
    backgroundColor: '#ffffff00',
    borderColor: 'black',
    borderWidth: 1,
  },
  pickerItem: {
    color: 'red'
  },
  input: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 5,
    paddingHorizontal: 14,
  },
  h1: {
    fontSize: 20,
  },
  modal: {
    top: 0,
    left: 0,
    width: 100,
    height: 100,
    zIndex: 1, /* Z-index de ModalA */
  },

  modal_content: {
    backgroundColor: "white",
    padding: 20,
    borderradius: 4,
    zIndex: 2, /* Z-index de ModalB (superior a ModalA) */
  }
}