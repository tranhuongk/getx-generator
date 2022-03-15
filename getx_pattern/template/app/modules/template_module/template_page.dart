import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../../app/modules/template_module/template_controller.dart';

class TemplatePage extends GetWidget<TemplateController> {
  const TemplatePage({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Template'.tr)),
      body: Obx(() => Text(controller.text)),
    );
  }
}
