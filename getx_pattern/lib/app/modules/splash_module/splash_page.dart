import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:getx_generator/app/routes/app_pages.dart';
import 'package:getx_generator/app/utils/widgets/app_bar/custom_app_bar.dart';

class SplashPage extends GetWidget {
  const SplashPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    ///Your Function in the Future
    Future.delayed(const Duration(seconds: 2), () {
      // 2s over, navigate to a new page
      Get.offNamed(AppRoutes.home);
    });

    ///Your widget
    return Scaffold(
      appBar: CustomAppBar(),
      body: Stack(
        children: [
          Center(
            child: FlutterLogo(
              size: Get.size.width * 0.4,
            ),
          ),
          Align(
            alignment: Alignment.bottomCenter,
            child: Container(
              margin: EdgeInsets.only(
                bottom: Get.context!.mediaQueryPadding.bottom + 10,
              ),
              child: const CircularProgressIndicator(),
            ),
          )
        ],
      ),
    );
  }
}
