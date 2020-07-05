import {NotFoundException} from '@nestjs/common';
import {Controller} from '@nestjs/common/interfaces';

export function CheckFacility(
    target: Controller,
    propertyName: string,
    propertyDescriptor: PropertyDescriptor,
): PropertyDescriptor {
    const allowedFacilities = ['bloeckle', 'kletterbox'];
    const originalMethod = propertyDescriptor.value;

    propertyDescriptor.value = function(...args: any[]): any {
        if (args.length === 0) throw new NotFoundException();

        const facility = args[0];
        if (!allowedFacilities.includes(facility)) throw new NotFoundException();

        // Call the original function
        return originalMethod.apply(this, args);
    };
    return propertyDescriptor;
}
