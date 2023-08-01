import React, { ComponentType, ReactNode } from 'react';
interface CreatedWrapperProps {
    children: ReactNode;
}
export declare function createWrapper<P>(Wrapper: ComponentType<P>, props: P): React.FC<CreatedWrapperProps>;
export {};
