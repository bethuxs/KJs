<?php if(isset($_GET['id'])){
$a = array(1=>array(
		'Amarillo', 'Azul', 'Rojo'
	),
	array(
		'Limon', 'Guayaba', 'Mango'
	)
);

die(json_encode($a[$_GET['id']]));
}

echo date("h:i:s d-M-Y");?>
<?php if(isset($_GET['c'])):?>
Este se cargo por confirmación
<?php endif;?>
<?php if(isset($_POST['nome'])):
sleep(1);
?>
<br/>Hola <?php echo $_POST['nome'] ?>
<?php endif;?>
